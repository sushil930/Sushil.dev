import { readFileSync } from 'fs';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { cert } from 'firebase-admin/app';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!getApps().length) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    // Priority 1: Use environment variable if available
    initializeApp({
      credential: cert(JSON.parse(serviceAccountKey))
    });
  } else {
    // Priority 2 & 3: Try Render's secret path, then local path
    const renderSecretPath = '/etc/secrets/pixelDev-serviceaccountkey.json';
    const localPath = path.resolve(__dirname, 'pixelDev-serviceaccountkey.json');
    let serviceAccountRaw;

    try {
      // Try reading from Render's path first
      serviceAccountRaw = readFileSync(renderSecretPath, 'utf8');
    } catch (renderError) {
      try {
        // Fallback to local path for development
        serviceAccountRaw = readFileSync(localPath, 'utf8');
      } catch (localError) {
        console.error('Could not load Firebase service account key.');
        console.error('Render path error:', (renderError as Error).message);
        console.error('Local path error:', (localError as Error).message);
        throw new Error('Firebase service account key is not available in environment variables or required file paths.');
      }
    }

    const serviceAccount = JSON.parse(serviceAccountRaw);
    initializeApp({
      credential: cert(serviceAccount)
    });
  }
}

export const db = getFirestore();