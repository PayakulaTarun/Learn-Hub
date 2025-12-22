
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'student-resource-hub-a758a';

if (!getApps().length) {
    initializeApp({
        projectId: PROJECT_ID,
    });
}

const db = getFirestore();

async function checkStatus() {
    console.log('--- SYNC BRAIN STATUS ---');
    try {
        const snapshot = await db.collection('knowledge_vectors').count().get();
        const total = snapshot.data().count;
        console.log(`Knowledge Base Docs: ${total}`);

        if (total > 0) {
            const lastUpdate = await db.collection('knowledge_vectors')
                .orderBy('updatedAt', 'desc')
                .limit(1)
                .get();
            
            if (!lastUpdate.empty) {
                const data = lastUpdate.docs[0].data();
                console.log(`Last Sync: ${data.updatedAt?.toDate()?.toISOString() || 'Unknown'}`);
                console.log(`Last File: ${data.filePath}`);
            }
        }
    } catch (e: any) {
        console.error('Error checking status:', e.message);
    }
}

checkStatus();
