import { readFileSync } from 'fs';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { cert } from 'firebase-admin/app';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!getApps().length) {
  const serviceAccountPath = path.resolve(__dirname, 'pixelDev-serviceaccountkey.json');
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    initializeApp({
      credential: cert(JSON.parse(serviceAccountKey))
    });
  } else {
    try {
      const serviceAccountRaw = readFileSync(serviceAccountPath, 'utf8');
      const serviceAccount = JSON.parse(serviceAccountRaw);
      initializeApp({
        credential: cert(serviceAccount)
      });
    } catch (error) {
      console.error('Could not load Firebase service account key from file or environment variable.');
      throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set and pixelDev-serviceaccountkey.json was not found.');
    }
  }
}

export const db = getFirestore();