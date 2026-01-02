import { readdir, readFile } from 'fs/promises';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
import { createHash } from 'crypto';
dotenv.config({ path: resolve(__dirname, '../.env') });

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { helpers, PredictionServiceClient } from '@google-cloud/aiplatform';

// --- PRODUCTION CONFIGURATION ---
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'student-resource-hub-a758a';
const LOCATION = 'us-central1';
const BATCH_SIZE = 5;
const RETRY_DELAY = 2000;

// Initialize Firebase
if (!getApps().length) {
    const options: any = { projectId: PROJECT_ID };

    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
            options.credential = cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY));
        } catch (e) {
            console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY found but invalid JSON. Falling back to ADC.');
        }
    }

    initializeApp(options);
}
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

// Vertex AI Config
const ENDPOINT = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/text-embedding-004`;

// --- INTERFACES ---
interface Chunk {
    filePath: string;
    index: string;
    content: string;
    heading: string;
    type: 'tutorial' | 'qa';
    hash: string;
}

const clientOptions = {
    apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
};
const predictionClient = new PredictionServiceClient(clientOptions);

function generateHash(content: string): string {
    return createHash('md5').update(content).digest('hex');
}

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

    // Handle Array format (common in evaluator data)
    if (Array.isArray(json)) {
        json.forEach((item, idx) => {
            const content = JSON.stringify(item, null, 2);
            chunks.push({
                filePath,
                index: idx.toString(),
                content,
                heading: item.title || item.name || `Asset ${idx} in ${filePath.split('/').pop()}`,
                type: 'tutorial',
                hash: generateHash(content)
            });
        });
        return chunks;
    }

    // Handle Standard Object format
    const overview = `Title: ${json.title || 'Untitled'}\nSubject: ${json.subject || 'General'}\nLevel: ${json.level || 'Beginner'}\n\nTheory:\n${json.theory || ''}\n\nSyntax:\n${json.syntax || ''}\n${json.summary || ''}`;
    chunks.push({
        filePath,
        index: '0',
        content: overview,
        heading: json.title || 'Untitled Material',
        type: 'tutorial',
        hash: generateHash(overview)
    });

    if (json.interview_questions?.length) {
        const qaText = json.interview_questions.map((q: any) => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n');
        const content = `Interview Questions on ${json.title || 'Topic'}:\n\n${qaText}`;
        chunks.push({
            filePath,
            index: 'iq',
            content,
            heading: `Interview: ${json.title || 'Topic'}`,
            type: 'tutorial',
            hash: generateHash(content)
        });
    }
    return chunks;
}

// Chunker Logic (QA DB)
function splitQaContent(json: any, filePath: string): Chunk[] {
    const chunks: Chunk[] = [];
    if (json.parts) {
        json.parts.forEach((part: any) => {
            part.questions.forEach((q: any) => {
                const searchStyles = ['interview', 'technical', 'advanced', 'strict_definition', 'deep_explanation'];
                const variants = q.answer_variants
                    .filter((v: any) => searchStyles.includes(v.style))
                    .map((v: any) => v.answer).join('\n');
                const content = `Question: ${q.question}\nTopic: ${q.topic}\n\nExpert Answers:\n${variants}`;
                chunks.push({
                    filePath,
                    index: `q_${q.id}`,
                    content,
                    heading: `Expert QA: ${q.question}`,
                    type: 'qa',
                    hash: generateHash(content)
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
    const qaDir = resolve(__dirname, '../qa_database');

    console.log(`🧠 [PRODUCTION] Syncing AI Brain (Incremental)...`);

    const tutorialFiles = await getFiles(contentDir);
    const qaFiles = await getFiles(qaDir);

    const allWork: { json: any, filePath: string, processor: (json: any, fp: string) => Chunk[] }[] = [
        ...tutorialFiles.map(f => ({ json: null, filePath: f, processor: splitTutorialContent })),
        ...qaFiles.map(f => ({ json: null, filePath: f, processor: splitQaContent }))
    ];

    let processedCount = 0;
    let skipCount = 0;

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

                // Incremental Lock: Skip if exactly same content hash exists
                const docSnap = await docRef.get();
                if (docSnap.exists) {
                    const existingData = docSnap.data();
                    if (existingData?.hash === chunk.hash) {
                        process.stdout.write('.');
                        skipCount++;
                        continue;
                    }
                }

                const vector = await generateEmbedding(chunk.content);
                await docRef.set({
                    filePath: chunk.filePath,
                    chunkIndex: chunk.index,
                    content: chunk.content,
                    heading: chunk.heading,
                    type: chunk.type,
                    hash: chunk.hash,
                    embedding: FieldValue.vector(vector),
                    updatedAt: FieldValue.serverTimestamp()
                });

                process.stdout.write(docSnap.exists ? '🆙' : '✅');
                processedCount++;

                if (processedCount % BATCH_SIZE === 0) {
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        } catch (e) {
            console.error(`\n❌ Error processing ${relativePath}:`, e);
        }
    }

    console.log(`\n\n🎉 SYNC COMPLETE`);
    console.log(`--------------------------`);
    console.log(`✅ New/Updated: ${processedCount}`);
    console.log(`⏭️  Skipped (No Change): ${skipCount}`);
    console.log(`🧠 Knowledge Base is ready.`);
}

main().catch(err => console.error(err));
