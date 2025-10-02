#!/usr/bin/env node
import fs from 'node:fs';
import process from 'node:process';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

function loadServiceAccount() {
  const explicitPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (explicitPath && fs.existsSync(explicitPath)) {
    const json = JSON.parse(fs.readFileSync(explicitPath, 'utf-8'));
    return { credential: admin.credential.cert(json), projectId: json.project_id };
  }
  return { credential: admin.credential.applicationDefault(), projectId: process.env.FIREBASE_PROJECT_ID };
}

async function resolveUser() {
  const uid = process.env.UID;
  const email = process.env.EMAIL;
  if (!uid && !email) {
    console.error('ERROR: Provide UID or EMAIL env to identify the user.');
    process.exit(1);
  }
  if (uid) return admin.auth().getUser(uid);
  return admin.auth().getUserByEmail(email);
}

async function main() {
  const { credential, projectId } = loadServiceAccount();
  if (!admin.apps.length) {
    admin.initializeApp({ credential, projectId });
  }

  try {
    const user = await resolveUser();

    // Merge existing claims
    const existingClaims = (await admin.auth().getUser(user.uid)).customClaims || {};
    const newClaims = { ...existingClaims, isAdmin: true };
    await admin.auth().setCustomUserClaims(user.uid, newClaims);

    const db = admin.firestore();
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      isAdmin: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('SUCCESS: Granted admin to user.');
    console.log(`UID: ${user.uid}`);
    console.log(`Email: ${user.email}`);
  } catch (err) {
    console.error('ERROR granting admin:', err);
    process.exit(1);
  }
}

main();


