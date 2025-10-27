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
import { 
  createUserViaAPI, 
  toggleUserStatusViaAPI, 
  getUsersViaAPI,
  getProfileViaAPI,
  updateProfileViaAPI,
} from "./apiOperations";
import { createErrorResponse, validateEmail, validatePassword, validateRequired } from "../../utils/errorHandling";

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
    // If uid matches current authenticated user, prefer API call which may
    // include derived fields or server-side logic. Otherwise fall back to Firestore read.
    const currentUid = auth?.currentUser?.uid;
    if ((!uid && currentUid) || (uid && currentUid && uid === currentUid)) {
      try {
        const apiResult = await getProfileViaAPI();
        if (apiResult && apiResult.success) {
          return { success: true, data: apiResult.data };
        }
        // If API fails, continue to fallback to Firestore
        console.warn('getProfileViaAPI failed, falling back to Firestore', apiResult?.error);
      } catch (apiErr) {
        console.warn('getProfileViaAPI threw, falling back to Firestore', apiErr);
      }
    }

    // Firestore fallback (or when fetching other users by UID)
    if (!uid) throw new Error('UID required to fetch other users');
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { success: true, data: { id: userSnap.id, ...userSnap.data() } };
    }
    return { success: false, error: "User not found" };
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
    const currentUid = auth?.currentUser?.uid;

    // If updating the current user's profile, try the API first which also
    // synchronizes Firebase Auth profile fields (displayName/photoURL).
    if (currentUid && uid === currentUid) {
      try {
        const apiResult = await updateProfileViaAPI(updateData);
        if (apiResult && apiResult.success) {
          return { success: true, data: apiResult.data };
        }
        console.warn('updateProfileViaAPI failed, falling back to Firestore', apiResult?.error);
      } catch (apiErr) {
        console.warn('updateProfileViaAPI threw, falling back to Firestore', apiErr);
      }
    }

    // Firestore update fallback
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
 * Get all user data for the Admin Dashboard - Uses API first, falls back to client-side
 */
export const getAllUsersData = async (limitCount = 100) => {
  try {
    // Try API first
    const apiResult = await getUsersViaAPI(limitCount, 0);
    if (apiResult.success) {
      return apiResult;
    }
    
    // Fallback to client-side query
    console.warn('API fetch failed, falling back to client-side:', apiResult.error);
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
 * Toggle user account status - Uses API first, falls back to client-side
 */
export const toggleUserAccountStatus = async (uid, newStatus) => {
  try {
    // Try API first
    const action = newStatus === 'inactive' ? 'disable' : 'enable';
    const apiResult = await toggleUserStatusViaAPI(uid, action);
    if (apiResult.success) {
      return { success: true, via: 'api' };
    }
    
    // Fallback to Firestore update only
    console.warn('API toggle failed, falling back to Firestore update:', apiResult.error);
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
 * Create user with credentials (Admin only) - Uses API first, falls back to client-side
 */
export const createUserWithCredentials = async ({ email, password, displayName, phone, role }) => {
  try {
    // Validate input
    validateRequired(email, 'Email');
    validateRequired(password, 'Password');
    validateEmail(email);
    validatePassword(password);

    // Try API first
    const apiResult = await createUserViaAPI({ email, password, displayName, phone, role });
    if (apiResult.success) {
      return apiResult;
    }
    
    // Fallback to client-side creation
    console.warn('API creation failed, falling back to client-side:', apiResult.error);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const isAdmin = String(role || '').toLowerCase() === 'admin';

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || '',
      phone: phone || '',
      isAdmin: isAdmin,
      status: 'active',
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
    return createErrorResponse(error, 'createUserWithCredentials');
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
