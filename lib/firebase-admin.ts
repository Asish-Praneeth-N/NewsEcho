import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// You need to set FIREBASE_SERVICE_ACCOUNT_KEY in your .env file
// It should be the JSON content of your service account key
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

if (getApps().length === 0) {
    if (serviceAccount) {
        initializeApp({
            credential: cert(serviceAccount),
        });
    } else {
        // Fallback or warning if no service account
        // This might fail if not running in an environment with default credentials
        console.warn("FIREBASE_SERVICE_ACCOUNT_KEY not found. Admin SDK might not work.");
        // Try initializing without credentials (works on GCP/Vercel if configured)
        try {
            initializeApp();
        } catch (e) {
            console.error("Failed to initialize Firebase Admin:", e);
        }
    }
}

const adminDb = getFirestore();

export { adminDb };
