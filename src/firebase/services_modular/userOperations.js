/* eslint-disable no-console */
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../firebase";
import {
  validateUserData,
  generateDefaultUserData,
} from "../schema";
import { normalizeFirestoreError } from "./mappers";

// ============================================================================
// USER OPERATIONS
// ============================================================================

/**
 * Create or update user profile
 */
export const createOrUpdateUser = async (firebaseUser, additionalData = {}) => {
  try {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    const baseData = generateDefaultUserData(firebaseUser);
    const userData = {
      ...baseData,
      ...additionalData,
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    };

    validateUserData(userData);

    if (userSnap.exists()) {
      // Update existing user
      await updateDoc(userRef, {
        ...additionalData,
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    } else {
      // Create new user
      await setDoc(userRef, userData);
    }

    return { success: true, data: userData };
  } catch (error) {
  const norm = normalizeFirestoreError(error);
  console.error("Error creating/updating user:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Get user profile by UID
 */
export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { success: true, data: { id: userSnap.id, ...userSnap.data() } };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
  const norm = normalizeFirestoreError(error);
  console.error("Error fetching user profile:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (uid, updateData) => {
  try {
    const userRef = doc(db, "users", uid);
    const updatePayload = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(userRef, updatePayload);
    return { success: true };
  } catch (error) {
  const norm = normalizeFirestoreError(error);
  console.error("Error updating user profile:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * 🚨 NEW FUNCTION: Get all user data for the Admin Dashboard 🚨
 */
export const getAllUsersData = async (limitCount = 100) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"), limit(limitCount));

    const snapshot = await getDocs(q);
    const users = snapshot.docs.map((d) => ({
      uid: d.id,
      ...d.data(),
    }));

    return { success: true, data: users };
  } catch (error) {
  const norm = normalizeFirestoreError(error);
  console.warn("[getAllUsersData]", norm.code, norm.message);
    return {
      success: false,
      error: norm.code,
      message: `Failed to fetch user list: ${norm.message}`,
    };
  }
};

/**
 * Toggle user account status in Firestore (client-side)
 * Note: Fully disabling a Firebase Auth account requires the Admin SDK on a trusted backend.
 */
export const toggleUserAccountStatus = async (uid, newStatus) => {
  // Try calling secure Cloud Function first
  const adminApiUrl = import.meta.env.VITE_ADMIN_API_URL || '/api/admin/toggleUser';
  try {
    const current = auth.currentUser;
    if (current) {
      const idToken = await current.getIdToken();
      const resp = await fetch(adminApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ uid, action: newStatus === 'inactive' ? 'disable' : 'enable' })
      });
      const data = await resp.json();
      if (resp.ok && data && data.success) {
        return { success: true, via: 'function' };
      }
      // If function responded but with an error, continue to fallback
    }
  } catch (err) {
    // Network or permission issue - fall back to Firestore update
    console.warn('Admin function call failed, falling back to Firestore update', err);
  }

  // Fallback: update the Firestore user document (client-side change only)
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { status: newStatus, updatedAt: serverTimestamp() });
    return { success: true, via: 'firestore' };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error toggling user account status:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Compatibility alias: getUserData
 * Existing UI expects getUserData; map to getUserProfile
 */
export const getUserData = async (uid) => {
  return await getUserProfile(uid);
};

/**
 * Update user's role (isAdmin flag)
 * newRole: 'admin' | 'student' | other
 */
export const updateUserRole = async (uid, newRole) => {
  try {
    const isAdmin = String(newRole).toLowerCase() === 'admin';
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { isAdmin, updatedAt: serverTimestamp() });
    return { success: true };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error('Error updating user role:', norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Create user with credentials (Admin only)
 */
export const createUserWithCredentials = async ({ email, password, displayName, phone }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || '',
      phone: phone || '',
      isAdmin: false,
      totalCoursesEnrolled: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", user.uid), userData);

    return {
      success: true,
      data: {
        uid: user.uid,
        email: user.email,
        credentials: { email, password }
      }
    };
  } catch (error) {
  const norm = normalizeFirestoreError(error);
  console.error("Error creating user with credentials:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

export default {
  // User operations
  createOrUpdateUser,
  getUserProfile,
  updateUserProfile,
  getAllUsersData,
  createUserWithCredentials,
  toggleUserAccountStatus,
  getUserData,
  updateUserRole,
};
