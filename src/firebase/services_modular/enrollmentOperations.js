/* eslint-disable no-console */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { validateEnrollmentData } from "../schema";
import { mapEnrollmentToV2, normalizeFirestoreError } from "./mappers";
import { v4 as uuidv4 } from "uuid";
import { increment } from "firebase/firestore";
import { 
  createEnrollmentViaAPI, 
  getUserEnrollmentsViaAPI, 
  updateEnrollmentViaAPI, 
  deleteEnrollmentViaAPI 
} from "./apiOperations";
import { createErrorResponse } from "../../utils/errorHandling";

// ============================================================================
// ENROLLMENT OPERATIONS
// ============================================================================

/**
 * Create enrollment record - Uses API first, falls back to client-side
 */
export const createEnrollment = async (enrollmentData) => {
  try {
    // Validate enrollment data
    validateEnrollment(enrollmentData);

    // Try API first
    const apiResult = await createEnrollmentViaAPI(enrollmentData);
    if (apiResult.success) {
      return apiResult;
    }
    
    // Fallback to client-side creation
    console.warn('API enrollment creation failed, falling back to client-side:', apiResult.error);
    
    // Create V2 enrollment with explicit enrollmentId
    const enrollmentId = enrollmentData.enrollmentId ?? uuidv4();
    const enrollmentPayload = {
      enrollmentId,
      userId: enrollmentData.userId,
      courseId: enrollmentData.courseId,
      courseTitle: enrollmentData.courseTitle,
      status: enrollmentData.status ?? "SUCCESS",
      paidAmount: enrollmentData.paymentData?.amount ?? enrollmentData.coursePrice ?? 0,
      enrolledAt: serverTimestamp(),
      enrolledBy: enrollmentData.enrolledBy || "user",
      paymentDetails: {
        paymentId: enrollmentData.paymentData?.paymentId ?? "",
        paymentDate: serverTimestamp(),
        method: enrollmentData.paymentData?.method || "online",
        reference: enrollmentData.paymentData?.reference || "",
      },
    };
    validateEnrollmentData(enrollmentPayload);

    const docRef = await addDoc(
      collection(db, "enrollments"),
      enrollmentPayload
    );

    // Update course enrollment count
    const courseRef = doc(db, "courses", enrollmentData.courseId);
    await updateDoc(courseRef, {
      totalEnrollments: increment(1),
    });

    // Update user enrollment count
    const userRef = doc(db, "users", enrollmentData.userId);
    await updateDoc(userRef, {
      totalCoursesEnrolled: increment(1),
    });

    return { success: true, data: { id: docRef.id, ...enrollmentPayload } };
  } catch (error) {
    return createErrorResponse(error, 'createEnrollment');
  }
};

/**
 * Get user enrollments - Uses API first, falls back to client-side
 */
export const getUserEnrollments = async (userId) => {
  try {
    // Try API first
    const apiResult = await getUserEnrollmentsViaAPI(userId, 'SUCCESS');
    if (apiResult.success) {
      return apiResult;
    }
    
    // Fallback to client-side query
    console.warn('API fetch failed, falling back to client-side:', apiResult.error);
    
    const enrollmentsRef = collection(db, "enrollments");
    const q = query(
      enrollmentsRef,
      where("userId", "==", userId),
      where("status", "==", "SUCCESS"),
      orderBy("enrolledAt", "desc")
    );

    const snapshot = await getDocs(q);
    const enrollments = snapshot.docs.map((d) =>
      mapEnrollmentToV2(d.data(), d.id)
    );
    return { success: true, data: enrollments };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.warn("[getUserEnrollments]", norm.code, norm.message);
    // Fallback for missing composite index: query by userId then filter & sort client-side
    if (norm.code === "INDEX_REQUIRED") {
      try {
        const fallbackQ = query(
          collection(db, "enrollments"),
          where("userId", "==", userId)
        );
        const snap = await getDocs(fallbackQ);
        const all = snap.docs.map((d) => mapEnrollmentToV2(d.data(), d.id));
        const filtered = all
          .filter((e) => e && e.status === "SUCCESS")
          .sort((a, b) => {
            const ta = a.enrolledAt?.toDate
              ? a.enrolledAt.toDate()
              : a.enrolledAt || 0;
            const tb = b.enrolledAt?.toDate
              ? b.enrolledAt.toDate()
              : b.enrolledAt || 0;
            return tb - ta;
          });

        return {
          success: true,
          data: filtered,
          fallback: true,
          indexRequired: true,
          indexMessage: norm.message,
        };
      } catch (innerErr) {
        const inner = normalizeFirestoreError(innerErr);
        console.error(
          "[getUserEnrollments] Fallback failed:",
          inner.code,
          inner.message
        );
        return { success: false, error: inner.code, message: inner.message };
      }
    }

    return { success: false, error: norm.code, message: norm.message };
  }
};

/**
 * Check if user is enrolled in course
 */
export const checkUserEnrollment = async (userId, courseId) => {
  try {
    const enrollmentsRef = collection(db, "enrollments");
    const q = query(
      enrollmentsRef,
      where("userId", "==", userId),
      where("courseId", "==", courseId),
      where("status", "==", "SUCCESS")
    );

    const snapshot = await getDocs(q);
    return {
      success: true,
      data: {
        isEnrolled: !snapshot.empty,
        enrollment: snapshot.empty
          ? null
          : mapEnrollmentToV2(snapshot.docs[0].data(), snapshot.docs[0].id),
      },
    };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error checking enrollment:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Update enrollment progress
 */
export const updateEnrollmentProgress = async (enrollmentId, progressData) => {
  try {
    const enrollmentRef = doc(db, "enrollments", enrollmentId);
    const updatePayload = {
      "progress.modulesCompleted": progressData.modulesCompleted,
      "progress.totalModules": progressData.totalModules,
      "progress.completionPercentage": progressData.completionPercentage,
      "progress.lastAccessedAt": serverTimestamp(),
      "progress.timeSpent": progressData.timeSpent,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(enrollmentRef, updatePayload);
    return { success: true };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error updating enrollment progress:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Get enrollment statistics for a user
 */
export const getUserEnrollmentStats = async (userId) => {
  try {
    const enrollmentsRef = collection(db, "enrollments");
    const q = query(
      enrollmentsRef,
      where("userId", "==", userId),
      where("status", "==", "SUCCESS")
    );

    const snapshot = await getDocs(q);
    const enrollments = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const totalEnrollments = enrollments.length;
    const offlineEnrollments = enrollments.filter(
      (e) => e.paymentDetails?.method === "offline" || e.enrolledBy === "admin"
    ).length;
    const onlineEnrollments = enrollments.filter(
      (e) => e.paymentDetails?.method === "online" && e.enrolledBy !== "admin"
    ).length;
    const freeEnrollments = enrollments.filter(
      (e) => e.paymentDetails?.method === "free" || e.paidAmount === 0
    ).length;

    return {
      success: true,
      data: {
        totalEnrollments,
        offlineEnrollments,
        onlineEnrollments,
        freeEnrollments,
        enrollments,
      },
    };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error fetching enrollment stats:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Update enrollment record - Uses API first, falls back to client-side
 */
export const updateEnrollment = async (enrollmentId, updateData) => {
  try {
    // Try API first
    const apiResult = await updateEnrollmentViaAPI(enrollmentId, updateData);
    if (apiResult.success) {
      return apiResult;
    }
    
    // Fallback to client-side update
    console.warn('API update failed, falling back to client-side:', apiResult.error);
    
    const enrollmentRef = doc(db, "enrollments", enrollmentId);
    const updatePayload = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(enrollmentRef, updatePayload);
    return { success: true };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error updating enrollment:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Delete enrollment record - Uses API first, falls back to client-side
 */
export const deleteEnrollment = async (enrollmentId) => {
  try {
    // Try API first
    const apiResult = await deleteEnrollmentViaAPI(enrollmentId);
    if (apiResult.success) {
      return apiResult;
    }
    
    // Fallback to client-side deletion
    console.warn('API deletion failed, falling back to client-side:', apiResult.error);
    
    // Get enrollment data before deletion
    const enrollmentDoc = await getDoc(doc(db, "enrollments", enrollmentId));
    if (!enrollmentDoc.exists()) {
      return { success: false, error: "Enrollment not found" };
    }

    const enrollmentData = enrollmentDoc.data();

    // Delete enrollment
    await updateDoc(doc(db, "enrollments", enrollmentId), {
      status: "CANCELLED",
      updatedAt: serverTimestamp()
    });

    // Update course enrollment count
    const courseRef = doc(db, "courses", enrollmentData.courseId);
    await updateDoc(courseRef, {
      totalEnrollments: increment(-1),
      updatedAt: serverTimestamp()
    });

    // Update user enrollment count
    const userRef = doc(db, "users", enrollmentData.userId);
    await updateDoc(userRef, {
      totalCoursesEnrolled: increment(-1),
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error deleting enrollment:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

export default {
  // Enrollment operations
  createEnrollment,
  getUserEnrollments,
  checkUserEnrollment,
  updateEnrollmentProgress,
  getUserEnrollmentStats,
  updateEnrollment,
  deleteEnrollment,
};
