// ============================================================================
// USER PROGRESS OPERATIONS
// ============================================================================

import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { mapProgressToV2, normalizeFirestoreError } from "./mappers";
import { checkUserEnrollment } from "./enrollmentOperations";

/**
 * Get user progress for a course
 */
export const getUserProgress = async (userId, courseId) => {
  try {
    const progressRef = doc(db, "user_progress", `${userId}_${courseId}`);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      return {
        success: true,
        data: mapProgressToV2(progressSnap.data(), progressSnap.id),
      };
    } else {
      return { success: false, error: "Progress not found" };
    }
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error fetching user progress:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Update user progress
 */
export const updateUserProgress = async (userId, courseId, progressData) => {
  try {
    const progressRef = doc(db, "user_progress", `${userId}_${courseId}`);
    const updatePayload = { ...progressData, updatedAt: serverTimestamp() };

    await updateDoc(progressRef, updatePayload);
    return { success: true };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error updating user progress:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

// ============================================================================
// SECURE VIDEO ACCESS (Backend validation gate simulated here)
// ============================================================================

export const getSecureVideoAccessUrl = async (userId, courseId, videoKey) => {
  try {
    const check = await checkUserEnrollment(userId, courseId);
    if (!check.success || !check.data.isEnrolled) {
      return { success: false, error: "ACCESS_DENIED" };
    }
    // In real backend, sign and return a time-limited URL from private storage
    // Here we just echo the key as a stand-in
    return { success: true, data: { signedUrl: String(videoKey) } };
  } catch (error) {
    return { success: false, error: "UNKNOWN" };
  }
};

export default {
  // User progress operations
  getUserProgress,
  updateUserProgress,
  getSecureVideoAccessUrl,
};
