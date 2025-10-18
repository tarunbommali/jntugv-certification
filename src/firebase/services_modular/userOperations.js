import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
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
    // Fetch users ordered by creation date, not filtering by anything
    const q = query(usersRef, orderBy("createdAt", "desc"), limit(limitCount));

    const snapshot = await getDocs(q);
    const users = snapshot.docs.map((d) => ({
      uid: d.id,
      ...d.data(),
    }));

    // NOTE: In a real app, you would batch user and enrollment data
    // retrieval here to minimize calls in the AdminUserDashboard.

    return { success: true, data: users };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.warn("[getAllUsersData]", norm.code, norm.message);
    // Using PERMISSION_DENIED as a common issue for admin calls
    return {
      success: false,
      error: norm.code,
      message: `Failed to fetch user list: ${norm.message}`,
    };
  }
};

export default {
  // User operations
  createOrUpdateUser,
  getUserProfile,
  updateUserProfile,
  getAllUsersData,
};
