import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'student-resource-hub-a758a';

let app: App | undefined;
let firestoreInstance: Firestore | undefined;
let authInstance: Auth | undefined;

function initFirebase() {
    if (!app) {
        if (getApps().length) {
            app = getApps()[0];
        } else {
            try {
                app = initializeApp({
                    projectId: PROJECT_ID,
                    credential: process.env.FIREBASE_SERVICE_ACCOUNT_KEY
                        ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
                        : undefined
                });
                console.log('✅ Firebase Admin Initialized (' + PROJECT_ID + ')');
            } catch (error) {
                console.error('❌ Firebase Admin Init Failed:', error);
                throw error;
            }
        }
    }
    return app;
}

export const db = new Proxy({} as Firestore, {
    get: (_target, prop) => {
        initFirebase();
        if (!firestoreInstance) firestoreInstance = getFirestore(app!);
        // @ts-ignore
        return firestoreInstance[prop];
    }
});

export const auth = new Proxy({} as Auth, {
    get: (_target, prop) => {
        initFirebase();
        if (!authInstance) authInstance = getAuth(app!);
        // @ts-ignore
        return authInstance[prop];
    }
});
