import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';


// Gather config from Vite environment variables (VITE_ prefix)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate required env vars early with clearer errors to avoid the
// generic FirebaseError: auth/invalid-api-key when variables are missing.
const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID'
];

const missing = requiredKeys.filter((k) => !import.meta.env[k]);
if (missing.length > 0) {
  // Throw a descriptive error during dev so the developer can fix .env
  throw new Error(
    `Missing required environment variables: ${missing.join(
      ', '
    )}.\nCopy .env.example to .env and fill these values. See README.md for details.`
  );
}

// Mask apiKey when logging so secrets aren't accidentally exposed in logs.
const maskedConfig = { ...firebaseConfig, apiKey: firebaseConfig.apiKey ? '*****' : undefined };
// Helpful debug output during dev builds (Vite will strip console in prod if configured)
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.debug('Firebase config (masked):', maskedConfig);
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Improve compatibility with restrictive networks by auto-detecting long polling
initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  experimentalForceLongPolling: false,
  useFetchStreams: false
});
export const db = getFirestore(app);




// Read and export the Razorpay Key ID
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID; 


export default app;

