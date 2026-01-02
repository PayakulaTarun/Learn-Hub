import { readdir, readFile } from 'fs/promises';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
import { createHash } from 'crypto';
dotenv.config({ path: resolve(__dirname, '../.env') });

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { helpers, PredictionServiceClient } from '@google-cloud/aiplatform';

// --- PARALLEL CONFIGURATION ---
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'student-resource-hub-a758a';
const LOCATION = 'us-central1';
const PARALLEL_BATCH_SIZE = 10; // Process 10 files simultaneously
const RETRY_DELAY = 2000;
const RATE_LIMIT_PAUSE = 60000; // Wait 60s when hitting rate limit

// Initialize Firebase
if (!getApps().length) {
    const options: any = { projectId: PROJECT_ID };
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
            options.credential = cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY));
        } catch (e) {
            console.warn('⚠️ Using ADC instead of service account key');
        }
    }
    initializeApp(options);
}
const db = getFirestore();

const ENDPOINT = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/text-embedding-004`;

interface Chunk {
    filePath: string;
    index: string;
    content: string;
    heading: string;
    type: 'tutorial' | 'qa';
    hash: string;
}

const clientOptions = { apiEndpoint: `${LOCATION}-aiplatform.googleapis.com` };
const predictionClient = new PredictionServiceClient(clientOptions);

function generateHash(content: string): string {
    return createHash('md5').update(content).digest('hex');
}

// Global rate limit tracker
let requestsThisMinute = 0;
let minuteStartTime = Date.now();

async function generateEmbedding(text: string, attempt = 0): Promise<number[]> {
    // Rate limit check (15 per minute)
    const now = Date.now();
    if (now - minuteStartTime > 60000) {
        requestsThisMinute = 0;
        minuteStartTime = now;
    }

    if (requestsThisMinute >= 15) {
        const waitTime = 60000 - (now - minuteStartTime);
        console.log(`\n⏳ Rate limit (15/min) - waiting ${Math.round(waitTime / 1000)}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        requestsThisMinute = 0;
        minuteStartTime = Date.now();
    }

    const instance = helpers.toValue({ content: text, task_type: 'RETRIEVAL_DOCUMENT' });
    const request = { endpoint: ENDPOINT, instances: [instance!] };

    try {
        requestsThisMinute++;
        const [response] = await predictionClient.predict(request);
        const predictions = response.predictions;

        if (!predictions || predictions.length === 0) {
            throw new Error('No embedding returned');
        }

        const embedding = predictions[0].structValue?.fields?.embeddings?.structValue?.fields?.values?.listValue?.values;
        return embedding!.map(v => v.numberValue!);
    } catch (e: any) {
        if ((e.code === 8 || e.code === 429) && attempt < 3) {
            const delay = RETRY_DELAY * Math.pow(2, attempt);
            console.log(`\n⏳ Quota error, retry in ${delay}ms (attempt ${attempt + 1}/3)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return generateEmbedding(text, attempt + 1);
        }
        throw e;
    }
}

function splitTutorialContent(json: any, filePath: string): Chunk[] {
    const chunks: Chunk[] = [];
    const overview = `Title: ${json.title}\nSubject: ${json.subject}\nLevel: ${json.level}\n\nTheory:\n${json.theory || ''}\n\nSyntax:\n${json.syntax || ''}\n${json.summary || ''}`;
    chunks.push({
        filePath,
        index: '0',
        content: overview,
        heading: json.title,
        type: 'tutorial',
        hash: generateHash(overview)
    });

    if (json.interview_questions?.length) {
        const qaText = json.interview_questions.map((q: any) => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n');
        const content = `Interview Questions on ${json.title}:\n\n${qaText}`;
        chunks.push({
            filePath,
            index: 'qa',
            content,
            heading: `${json.title} - Interview Prep`,
            type: 'tutorial',
            hash: generateHash(content)
        });
    }
    return chunks;
}

function splitQaContent(json: any, filePath: string): Chunk[] {
    const chunks: Chunk[] = [];
    if (!json.parts) return chunks;

    json.parts.forEach((part: any, partIdx: number) => {
        if (!part.questions) return;
        part.questions.forEach((q: any, qIdx: number) => {
            const answers = q.answer_variants
                ?.filter((v: any) => ['interview', 'technical', 'deep_explanation'].includes(v.style))
                .map((v: any) => v.answer)
                .join('\n\n') || '';

            const content = `QUESTION: ${q.question}\n\nEXPERT ANSWERS:\n${answers}`;
            chunks.push({
                filePath,
                index: `${partIdx}_${qIdx}`,
                content,
                heading: q.question,
                type: 'qa',
                hash: generateHash(content)
            });
        });
    });
    return chunks;
}

async function getFiles(dir: string): Promise<string[]> {
    try {
        const dirents = await readdir(dir, { withFileTypes: true });
        const files = await Promise.all(dirents.map(async (dirent) => {
            const res = resolve(dir, dirent.name);
            return dirent.isDirectory() ? getFiles(res) : res;
        }));
        return Array.prototype.concat(...files).filter(f => f.endsWith('.json'));
    } catch (e) { return []; }
}

// Process single file
async function processFile(item: any): Promise<{ success: boolean; skipped: boolean; error?: any }> {
    const isTutorial = item.filePath.includes('content');
    const relativePath = isTutorial
        ? item.filePath.split('content')[1].replace(/\\/g, '/')
        : item.filePath.split('qa_database')[1].replace(/\\/g, '/');

    try {
        const raw = await readFile(item.filePath, 'utf-8');
        const json = JSON.parse(raw);
        const chunks = item.processor(json, relativePath);

        let processed = 0;
        let skipped = 0;

        for (const chunk of chunks) {
            const docId = `${chunk.filePath.replace(/\//g, '_')}_${chunk.index}`.replace(/__/g, '_');
            const docRef = db.collection('knowledge_vectors').doc(docId);

            const docSnap = await docRef.get();
            if (docSnap.exists && docSnap.data()?.hash === chunk.hash) {
                skipped++;
                continue;
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

            processed++;
        }

        return { success: true, skipped: skipped === chunks.length };
    } catch (e: any) {
        return { success: false, skipped: false, error: e };
    }
}

async function main() {
    console.log(`\n⚡ PARALLEL SYNC-BRAIN - FAST MODE\n`);
    console.log(`Configuration:`);
    console.log(`- Parallel batch size: ${PARALLEL_BATCH_SIZE}`);
    console.log(`- Rate limit: 15 requests/minute`);
    console.log(`- Project: ${PROJECT_ID}\n`);

    const contentDir = resolve(__dirname, '../content');
    const qaDir = resolve(__dirname, '../qa_database');

    const tutorialFiles = await getFiles(contentDir);
    const qaFiles = await getFiles(qaDir);

    const allWork = [
        ...tutorialFiles.map(f => ({ filePath: f, processor: splitTutorialContent })),
        ...qaFiles.map(f => ({ filePath: f, processor: splitQaContent }))
    ];

    console.log(`📦 Found ${allWork.length} files to process\n`);

    let totalProcessed = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    const startTime = Date.now();

    // Process in parallel batches
    for (let i = 0; i < allWork.length; i += PARALLEL_BATCH_SIZE) {
        const batch = allWork.slice(i, i + PARALLEL_BATCH_SIZE);
        const batchNum = Math.floor(i / PARALLEL_BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(allWork.length / PARALLEL_BATCH_SIZE);

        console.log(`\n📦 Batch ${batchNum}/${totalBatches} (${batch.length} files)...`);

        const results = await Promise.allSettled(batch.map(item => processFile(item)));

        results.forEach((result, idx) => {
            if (result.status === 'fulfilled') {
                if (result.value.success) {
                    if (result.value.skipped) {
                        process.stdout.write('⏭️ ');
                        totalSkipped++;
                    } else {
                        process.stdout.write('✅');
                        totalProcessed++;
                    }
                } else {
                    process.stdout.write('❌');
                    totalErrors++;
                }
            } else {
                process.stdout.write('💥');
                totalErrors++;
            }
        });

        // Progress
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        const processed = i + batch.length;
        const percent = Math.round((processed / allWork.length) * 100);
        console.log(` ${percent}% (${elapsed}s)`);
    }

    const totalTime = Math.round((Date.now() - startTime) / 1000);

    console.log(`\n\n🎉 SYNC COMPLETE!`);
    console.log(`--------------------------`);
    console.log(`✅ Processed: ${totalProcessed}`);
    console.log(`⏭️  Skipped: ${totalSkipped}`);
    console.log(`❌ Errors: ${totalErrors}`);
    console.log(`⏱️  Time: ${Math.floor(totalTime / 60)}m ${totalTime % 60}s`);
    console.log(`🚀 Speed: ${Math.round(allWork.length / (totalTime / 60))} files/min`);
    console.log(`\n🧠 Knowledge Base is ready!\n`);
}

main().catch(err => console.error('Fatal error:', err));
