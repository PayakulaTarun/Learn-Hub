import { readdir, readFile } from 'fs/promises';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: resolve(__dirname, '../.env') });

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { helpers, PredictionServiceClient } from '@google-cloud/aiplatform';

// --- PRODUCTION CONFIGURATION ---
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'student-resource-hub-a758a';
const LOCATION = 'us-central1';
const BATCH_SIZE = 5; // Low batch size to respect Google Cloud Quotas
const RETRY_DELAY = 2000;

// Initialize Firebase
if (!getApps().length) {
    initializeApp({ projectId: PROJECT_ID });
}
const db = getFirestore();

// Vertex AI Config
const ENDPOINT = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/text-embedding-004`;

// --- INTERFACES ---
interface Chunk {
    filePath: string;
    index: string;
    content: string;
    heading: string;
    type: 'tutorial' | 'qa';
}

const clientOptions = {
    apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
};
const predictionClient = new PredictionServiceClient(clientOptions);

/**
 * Generates embedding with exponential backoff for quota management
 */
async function generateEmbedding(text: string, attempt = 0): Promise<number[]> {
    const instance = helpers.toValue({ content: text, task_type: 'RETRIEVAL_DOCUMENT' });
    const request = { endpoint: ENDPOINT, instances: [instance!] };

    try {
        const [response] = await predictionClient.predict(request);
        const predictions = response.predictions;

        if (!predictions || predictions.length === 0) {
            throw new Error('No embedding returned from Vertex AI');
        }

        const embedding = predictions[0].structValue?.fields?.embeddings?.structValue?.fields?.values?.listValue?.values;
        return embedding!.map(v => v.numberValue!);
    } catch (e: any) {
        // Handle Quota Exhausted (8) or Rate Limit (429)
        if ((e.code === 8 || e.code === 429) && attempt < 5) {
            const delay = RETRY_DELAY * Math.pow(2, attempt);
            console.log(`\n⏳ Quota hit. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return generateEmbedding(text, attempt + 1);
        }
        throw e;
    }
}

// Chunker Logic (Tutorial)
function splitTutorialContent(json: any, filePath: string): Chunk[] {
    const chunks: Chunk[] = [];
    const overview = `Title: ${json.title}\nSubject: ${json.subject}\nLevel: ${json.level}\n\nTheory:\n${json.theory || ''}\n\nSyntax:\n${json.syntax || ''}\n${json.summary || ''}`;
    chunks.push({ filePath, index: '0', content: overview, heading: json.title, type: 'tutorial' });

    if (json.interview_questions?.length) {
        const qaText = json.interview_questions.map((q: any) => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n');
        chunks.push({ filePath, index: 'iq', content: `Interview Questions on ${json.title}:\n\n${qaText}`, heading: 'Interview Questions', type: 'tutorial' });
    }
    return chunks;
}

// Chunker Logic (QA DB)
function splitQaContent(json: any, filePath: string): Chunk[] {
    const chunks: Chunk[] = [];
    if (json.parts) {
        json.parts.forEach((part: any) => {
            part.questions.forEach((q: any) => {
                const variants = q.answer_variants.filter((v: any) => v.style === 'technical' || v.style === 'deep_explanation').map((v: any) => v.answer).join('\n');
                const content = `Question: ${q.question}\nTopic: ${q.topic}\n\nCore Answer:\n${variants}`;
                chunks.push({
                    filePath,
                    index: `q_${q.id}`,
                    content,
                    heading: `Expert QA: ${q.question}`,
                    type: 'qa'
                });
            });
        });
    }
    return chunks;
}

async function getFiles(dir: string): Promise<string[]> {
    try {
        const dirents = await readdir(dir, { withFileTypes: true });
        const files = await Promise.all(dirents.map((dirent) => {
            const res = resolve(dir, dirent.name);
            return dirent.isDirectory() ? getFiles(res) : res;
        }));
        return Array.prototype.concat(...files).filter(f => f.endsWith('.json'));
    } catch (e) { return []; }
}

async function main() {
    const contentDir = resolve(__dirname, '../content');
    const qaDir = resolve(__dirname, '../qa_database/json_parts');

    console.log(`🧠 [PRODUCTION] Syncing AI Brain...`);

    const tutorialFiles = await getFiles(contentDir);
    const qaFiles = await getFiles(qaDir);

    const allWork: { json: any, filePath: string, processor: (json: any, fp: string) => Chunk[] }[] = [
        ...tutorialFiles.map(f => ({ json: null, filePath: f, processor: splitTutorialContent })),
        ...qaFiles.map(f => ({ json: null, filePath: f, processor: splitQaContent }))
    ];

    let processedCount = 0;
    for (const item of allWork) {
        const isTutorial = item.filePath.includes('content');
        const relativePath = isTutorial
            ? item.filePath.split('content')[1].replace(/\\/g, '/')
            : item.filePath.split('qa_database')[1].replace(/\\/g, '/');

        try {
            const raw = await readFile(item.filePath, 'utf-8');
            const json = JSON.parse(raw);
            const chunks = item.processor(json, relativePath);

            for (const chunk of chunks) {
                const docId = `${chunk.filePath.replace(/\//g, '_')}_${chunk.index}`.replace(/__/g, '_');
                const docRef = db.collection('knowledge_vectors').doc(docId);

                // Optimization: Skip if exists
                const docSnap = await docRef.get();
                if (docSnap.exists) {
                    process.stdout.write('.');
                    continue;
                }

                const vector = await generateEmbedding(chunk.content);
                await docRef.set({
                    filePath: chunk.filePath,
                    chunkIndex: chunk.index,
                    content: chunk.content,
                    heading: chunk.heading,
                    type: chunk.type,
                    embedding: FieldValue.vector(vector),
                    updatedAt: FieldValue.serverTimestamp()
                });
                process.stdout.write('✅');
                processedCount++;

                // Throttling for Quota safety
                if (processedCount % BATCH_SIZE === 0) {
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        } catch (e) {
            console.error(`\n❌ Error processing ${relativePath}:`, e);
        }
    }

    console.log(`\n🎉 Processed ${processedCount} new chunks. Brain is PRODUCTION ready.`);
}

main().catch(err => console.error(err));
