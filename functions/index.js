/* eslint-disable no-console */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Initialize admin SDK
admin.initializeApp();

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

// Basic CORS headers + early preflight handling to ensure OPTIONS succeeds before auth checks
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  const requestHeaders = req.headers['access-control-request-headers'];

  res.set('Access-Control-Allow-Origin', origin);
  res.set('Vary', 'Origin');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Allow-Methods', corsOptions.methods.join(','));
  const allowedHeaders = requestHeaders
    ? requestHeaders
    : `${corsOptions.allowedHeaders.join(',')},authorization`;

  res.set('Access-Control-Allow-Headers', allowedHeaders);
  res.set('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(corsOptions.optionsSuccessStatus).end();
  }

  return next();
});

app.use(cors(corsOptions));
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
    req.auth = decoded;
    return next();
  } catch (error) {
    console.error('verifyAuth error:', error && error.message ? error.message : error);
    return res.status(401).json({ success: false, error: 'Invalid auth token' });
  }
}

// Middleware to check admin permissions
async function verifyAdmin(req, res, next) {
  try {
    const userDoc = await admin.firestore().collection('users').doc(req.auth.uid).get();
    if (!userDoc.exists || !userDoc.data().isAdmin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    return next();
  } catch (error) {
    console.error('verifyAdmin error:', error);
    return res.status(500).json({ success: false, error: 'Failed to verify admin status' });
  }
}

// POST /admin/toggleUser
// body: { uid: string, action: 'disable'|'enable' }
app.post('/admin/toggleUser', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { uid, action } = req.body || {};
    if (!uid || !action) return res.status(400).json({ success: false, error: 'Missing uid or action' });

    const disabled = action === 'disable';
    await admin.auth().updateUser(uid, { disabled });

    // Update user status in Firestore
    await admin.firestore().collection('users').doc(uid).update({
      status: disabled ? 'inactive' : 'active',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('Cloud Function toggleUser error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

// POST /admin/createUser
// body: { email: string, password: string, displayName: string, phone: string, role: string }
app.post('/admin/createUser', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { email, password, displayName, phone, role } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, error: 'Missing email or password' });

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: displayName || '',
    });

    const isAdmin = String(role || '').toLowerCase() === 'admin';
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: displayName || '',
      phone: phone || '',
      isAdmin: isAdmin,
      status: 'active',
      totalCoursesEnrolled: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await admin.firestore().collection('users').doc(userRecord.uid).set(userData);

    return res.json({ 
      success: true, 
      data: { 
        uid: userRecord.uid, 
        email: userRecord.email,
        credentials: { email, password }
      } 
    });
  } catch (err) {
    console.error('Cloud Function createUser error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

// POST /admin/createEnrollment
// body: { userId: string, courseId: string, courseTitle: string, coursePrice: number, paymentData: object, enrolledBy: string }
app.post('/admin/createEnrollment', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { userId, courseId, courseTitle, coursePrice, paymentData, enrolledBy } = req.body || {};
    if (!userId || !courseId) return res.status(400).json({ success: false, error: 'Missing userId or courseId' });

    const enrollmentId = `ENR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const enrollmentData = {
      enrollmentId,
      userId,
      courseId,
      courseTitle: courseTitle || 'Course',
      status: 'SUCCESS',
      paidAmount: coursePrice || 0,
      enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
      enrolledBy: enrolledBy || 'admin',
      paymentDetails: {
        paymentId: paymentData?.paymentId || `ADMIN_${Date.now()}`,
        paymentDate: admin.firestore.FieldValue.serverTimestamp(),
        method: paymentData?.method || 'offline',
        reference: paymentData?.reference || '',
        amountPaid: paymentData?.amountPaid || coursePrice || 0,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Create enrollment record
    const enrollmentRef = await admin.firestore().collection('enrollments').add(enrollmentData);

    // Update course enrollment count
    await admin.firestore().collection('courses').doc(courseId).update({
      totalEnrollments: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update user enrollment count
    await admin.firestore().collection('users').doc(userId).update({
      totalCoursesEnrolled: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.json({ 
      success: true, 
      data: { 
        id: enrollmentRef.id, 
        ...enrollmentData 
      } 
    });
  } catch (err) {
    console.error('Cloud Function createEnrollment error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

// GET /admin/enrollments/:userId
app.get('/admin/enrollments/:userId', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status = 'SUCCESS' } = req.query;

    const enrollmentsRef = admin.firestore().collection('enrollments');
    const query = enrollmentsRef
      .where('userId', '==', userId)
      .where('status', '==', status)
      .orderBy('enrolledAt', 'desc');

    const snapshot = await query.get();
    const enrollments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.json({ success: true, data: enrollments });
  } catch (err) {
    console.error('Cloud Function getEnrollments error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

// PUT /admin/enrollments/:enrollmentId
app.put('/admin/enrollments/:enrollmentId', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const updateData = req.body || {};

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.enrollmentId;
    delete updateData.userId;
    delete updateData.courseId;
    delete updateData.enrolledAt;
    delete updateData.createdAt;

    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await admin.firestore().collection('enrollments').doc(enrollmentId).update(updateData);

    return res.json({ success: true });
  } catch (err) {
    console.error('Cloud Function updateEnrollment error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

// DELETE /admin/enrollments/:enrollmentId
app.delete('/admin/enrollments/:enrollmentId', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    // Get enrollment data before deletion
    const enrollmentDoc = await admin.firestore().collection('enrollments').doc(enrollmentId).get();
    if (!enrollmentDoc.exists) {
      return res.status(404).json({ success: false, error: 'Enrollment not found' });
    }

    const enrollmentData = enrollmentDoc.data();

    // Delete enrollment
    await admin.firestore().collection('enrollments').doc(enrollmentId).delete();

    // Update course enrollment count
    await admin.firestore().collection('courses').doc(enrollmentData.courseId).update({
      totalEnrollments: admin.firestore.FieldValue.increment(-1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update user enrollment count
    await admin.firestore().collection('users').doc(enrollmentData.userId).update({
      totalCoursesEnrolled: admin.firestore.FieldValue.increment(-1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('Cloud Function deleteEnrollment error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

// GET /admin/users
app.get('/admin/users', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    
    const usersRef = admin.firestore().collection('users');
    const query = usersRef
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    const snapshot = await query.get();
    const users = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    return res.json({ success: true, data: users });
  } catch (err) {
    console.error('Cloud Function getUsers error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

// GET /admin/courses
app.get('/admin/courses', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const coursesRef = admin.firestore().collection('courses');
    const query = coursesRef.orderBy('createdAt', 'desc');

    const snapshot = await query.get();
    const courses = snapshot.docs.map(doc => ({
      courseId: doc.id,
      ...doc.data()
    }));

    return res.json({ success: true, data: courses });
  } catch (err) {
    console.error('Cloud Function getCourses error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

// GET /admin/courses/:courseId
app.get('/admin/courses/:courseId', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;
    const docRef = await admin.firestore().collection('courses').doc(courseId).get();
    if (!docRef.exists) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    return res.json({ success: true, data: { courseId: docRef.id, ...docRef.data() } });
  } catch (err) {
    console.error('Cloud Function getCourse error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

// POST /admin/courses
app.post('/admin/courses', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const payload = req.body || {};

    // Minimal validation
    const title = String(payload.title || '').trim();
    if (!title || title.length < 3) {
      return res.status(400).json({ success: false, error: 'Title is required (min 3 chars)' });
    }

    const courseData = {
      ...payload,
      title,
      createdBy: req.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      totalEnrollments: 0,
      averageRating: 0,
      totalRatings: 0,
      isPublished: false,
      isFeatured: Boolean(payload.isFeatured),
      status: 'draft',
    };

    // Disallow client-supplied timestamps/derived fields
    delete courseData.id;
    delete courseData.courseId;
    delete courseData.totalEnrollments;
    delete courseData.averageRating;
    delete courseData.totalRatings;
    delete courseData.createdAt; // we set above
    delete courseData.updatedAt; // we set above

    const ref = await admin.firestore().collection('courses').add({
      ...payload,
      title,
      createdBy: req.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      totalEnrollments: 0,
      averageRating: 0,
      totalRatings: 0,
      isPublished: false,
      isFeatured: Boolean(payload.isFeatured),
      status: 'draft',
    });

    return res.json({ success: true, data: { id: ref.id } });
  } catch (err) {
    console.error('Cloud Function createCourse error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

// PUT /admin/courses/:courseId
app.put('/admin/courses/:courseId', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;
    const updateData = req.body || {};

    // Remove non-updatable/derived fields
    const forbidden = [
      'id','courseId','createdAt','createdBy','totalEnrollments','averageRating','totalRatings'
    ];
    forbidden.forEach((k) => delete updateData[k]);

    // Optional validation
    if (updateData.title) {
      const t = String(updateData.title).trim();
      if (!t || t.length < 3) {
        return res.status(400).json({ success: false, error: 'Invalid title' });
      }
      updateData.title = t;
    }

    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await admin.firestore().collection('courses').doc(courseId).update(updateData);
    return res.json({ success: true });
  } catch (err) {
    console.error('Cloud Function updateCourse error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

// DELETE /admin/courses/:courseId
app.delete('/admin/courses/:courseId', verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;
    await admin.firestore().collection('courses').doc(courseId).delete();
    return res.json({ success: true });
  } catch (err) {
    console.error('Cloud Function deleteCourse error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

// GET /profile - return current authenticated user's profile from Firestore
app.get('/profile', verifyAuth, async (req, res) => {
  try {
    const uid = req.auth.uid;
    const userRef = admin.firestore().collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    return res.json({ success: true, data: { uid: userDoc.id, ...userDoc.data() } });
  } catch (err) {
    console.error('Cloud Function getProfile error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

// PUT /profile - update current user's profile (Firestore + optional Firebase Auth fields)
app.put('/profile', verifyAuth, async (req, res) => {
  try {
    const uid = req.auth.uid;
    const payload = req.body || {};

    // Only allow a whitelist of profile fields to be updated
    const allowedFields = [
      'displayName',
      'phone',
      'photoURL',
      'bio',
      'address',
      // Extended fields for ProfileEdit
      'firstName',
      'lastName',
      'college',
      'gender',
      'dateOfBirth',
      'skills',
      'socialLinks',
    ];

    const updateData = {};
    allowedFields.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        updateData[key] = payload[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields provided to update' });
    }

    // Basic server-side validations
    const errors = [];
    if (updateData.displayName && String(updateData.displayName).trim().length < 3) {
      errors.push('Display name must be at least 3 characters');
    }
    if (updateData.phone && !/^\+?[0-9\-()\s]{7,20}$/.test(String(updateData.phone))) {
      errors.push('Invalid phone number format');
    }
    if (updateData.photoURL) {
      try { new URL(String(updateData.photoURL)); } catch { errors.push('Invalid photoURL'); }
    }
    if (updateData.bio && String(updateData.bio).length > 1000) {
      errors.push('Bio is too long (max 1000 characters)');
    }
    if (updateData.address && String(updateData.address).length > 500) {
      errors.push('Address is too long (max 500 characters)');
    }
    if (updateData.skills && !Array.isArray(updateData.skills)) {
      errors.push('Skills must be an array');
    }
    if (updateData.socialLinks && typeof updateData.socialLinks !== 'object') {
      errors.push('Social links must be an object');
    }
    if (errors.length) {
      return res.status(400).json({ success: false, error: errors.join('; ') });
    }

    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    // Update Firestore profile
    await admin.firestore().collection('users').doc(uid).update(updateData);

    // If displayName or photoURL changed, also update Firebase Auth profile
    const authUpdate = {};
    if (updateData.displayName) authUpdate.displayName = updateData.displayName;
    if (updateData.photoURL) authUpdate.photoURL = updateData.photoURL;

    if (Object.keys(authUpdate).length > 0) {
      await admin.auth().updateUser(uid, authUpdate);
    }

    const updatedDoc = await admin.firestore().collection('users').doc(uid).get();

    return res.json({ success: true, data: { uid: updatedDoc.id, ...updatedDoc.data() } });
  } catch (err) {
    console.error('Cloud Function updateProfile error:', err);
    const msg = err && err.message ? err.message : String(err);
    return res.status(500).json({ success: false, error: msg || 'UNKNOWN' });
  }
});

exports.api = functions.https.onRequest(app);
