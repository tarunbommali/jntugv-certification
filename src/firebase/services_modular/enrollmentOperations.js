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

// ============================================================================
// ENROLLMENT OPERATIONS
// ============================================================================

/**
 * Create enrollment record
 */
export const createEnrollment = async (enrollmentData) => {
  try {
    // Create V2 enrollment with explicit enrollmentId
    const enrollmentId = enrollmentData.enrollmentId ?? uuidv4();
    const enrollmentPayload = {
      enrollmentId,
      userId: enrollmentData.userId,
      courseId: enrollmentData.courseId,
      courseTitle: enrollmentData.courseTitle,
      status: enrollmentData.status ?? "SUCCESS",
      paidAmount: enrollmentData.paymentData?.amount,
      enrolledAt: serverTimestamp(),
      paymentDetails: {
        paymentId: enrollmentData.paymentData?.paymentId ?? "",
        paymentDate: serverTimestamp(),
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
    const norm = normalizeFirestoreError(error);
    console.error("Error creating enrollment:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Get user enrollments
 */
export const getUserEnrollments = async (userId) => {
  try {
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

export default {
  // Enrollment operations
  createEnrollment,
  getUserEnrollments,
  checkUserEnrollment,
  updateEnrollmentProgress,
};
