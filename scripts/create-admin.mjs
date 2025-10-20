#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Loads the Firebase Service Account credentials robustly.
 * It strictly prioritizes loading from a JSON file path over relying on ADC.
 */
function loadServiceAccount() {
  const explicitPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (explicitPath) {
    try {
      if (!fs.existsSync(explicitPath)) {
        throw new Error(`Service account file not found at path: ${explicitPath}`);
      }
      const json = JSON.parse(fs.readFileSync(explicitPath, 'utf-8'));
      
      console.log(`INFO: Using Service Account file from ${explicitPath}`);
      return { 
        credential: admin.credential.cert(json), 
        projectId: json.project_id 
      };
    } catch (e) {
      console.error(`FATAL ERROR: Could not load Service Account JSON file.`, e.message);
      process.exit(1);
    }
  }

  // Fallback (Only works reliably on Google Cloud infrastructure)
  const projectId = process.env.FIREBASE_PROJECT_ID;
  console.warn('WARN: No service account path provided. Attempting to use Application Default Credentials (ADC).');
  console.warn('WARN: This may fail if you are not authenticated locally via "gcloud auth application-default login".');
  
  return { 
    credential: admin.credential.applicationDefault(), 
    projectId: projectId 
  };
}

async function main() {
  // Read Admin details from .env
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const displayName = process.env.ADMIN_NAME || 'Administrator';

  if (!email || !password) {
    console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD env vars are required in .env.');
    process.exit(1);
  }

  const { credential, projectId } = loadServiceAccount();

  if (!projectId) {
    console.error('ERROR: Project ID is required. Please set FIREBASE_PROJECT_ID in .env or ensure your service account JSON file includes it.');
    process.exit(1);
  }

  if (!admin.apps.length) {
    admin.initializeApp({ credential, projectId });
  }

  try {
    // 1) Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
      emailVerified: true,
      disabled: false
    });

    // 2) Set custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, { isAdmin: true });

    // 3) Create/update Firestore profile
    // NOTE: This uses the canonical 'users' collection for backend admin management.
    // The frontend app will use the Canvas-specific path for user profiles.
    const db = admin.firestore();
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || '',
      photoURL: userRecord.photoURL || '',
      isAdmin: true,
      isActive: true,
      emailVerified: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('---');
    console.log('✅ SUCCESS: Admin user created.');
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Email: ${userRecord.email}`);
    console.log('---');
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      console.error('ERROR: Email already exists. If you want to grant admin status to an existing user, you need a separate script for that.');
    } else {
      console.error('FATAL ERROR creating admin user:', err.message);
    }
    process.exit(1);
  }
}

main();
