const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Initialize admin SDK
admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Middleware to validate an Authorization: Bearer <idToken> header
async function verifyAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing or invalid Authorization header' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    // You can restrict further (e.g., only admins allowed) by checking custom claims
    req.auth = decoded;
    return next();
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.error('verifyAuth error:', error && error.message ? error.message : error);
    return res.status(401).json({ success: false, error: 'Invalid auth token' });
  }
}

// POST /admin/toggleUser
// body: { uid: string, action: 'disable'|'enable' }
app.post('/admin/toggleUser', verifyAuth, async (req, res) => {
  try {
    const { uid, action } = req.body || {};
    if (!uid || !action) return res.status(400).json({ success: false, error: 'Missing uid or action' });

    // Optional: restrict to admin users only via custom claims
    if (!req.auth || !req.auth.admin) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }

    const disabled = action === 'disable';
    await admin.auth().updateUser(uid, { disabled });

    return res.json({ success: true });
  } catch (err) {
    /* eslint-disable-next-line no-console */
    console.error('Cloud Function toggleUser error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

exports.api = functions.https.onRequest(app);
