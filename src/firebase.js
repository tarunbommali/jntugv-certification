import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Improve compatibility with corporate networks/ad-blockers by forcing long polling
initializeFirestore(app, { experimentalForceLongPolling: true, useFetchStreams: false });
export const db = getFirestore(app);




// Read and export the Razorpay Key ID
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID; 


export default app;

