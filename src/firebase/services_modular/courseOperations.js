import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { validateCourseData } from "../schema";
import { mapCourseToV2, normalizeFirestoreError } from "./mappers";

// ============================================================================
// COURSE OPERATIONS
// ============================================================================

/**
 * Get all published courses
 */
export const getAllCourses = async (limitCount = 50) => {
  try {
    const coursesRef = collection(db, "courses");
    const q = query(
      coursesRef,
      where("isPublished", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const courses = snapshot.docs.map((d) =>
      mapCourseToV2({ id: d.id, ...d.data() })
    );
    return { success: true, data: courses };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.warn("[getAllCourses]", norm.code, norm.message);

    // If Firestore requires a composite index for this compound query, retry with
    // a single-field query and filter client-side as a safe fallback. This avoids
    // throwing an error in the UI while still returning the expected published
    // courses sorted by creation time.
    if (norm.code === "INDEX_REQUIRED") {
      try {
        console.warn(
          "[getAllCourses] Falling back to single-field query and client-side filter due to missing index. Recommended: create the composite index shown in the Firebase console error."
        );
        const fallbackQ = query(
          collection(db, "courses"),
          orderBy("createdAt", "desc"),
          limit(limitCount)
        );

        const snapshot = await getDocs(fallbackQ);
        const all = snapshot.docs.map((d) =>
          mapCourseToV2({ id: d.id, ...d.data() })
        );
        const filtered = all.filter((c) => Boolean(c && c.isPublished));

        return {
          success: true,
          data: filtered,
          fallback: true,
          indexRequired: true,
          indexMessage: norm.message,
        };
      } catch (innerErr) {
        const innerNorm = normalizeFirestoreError(innerErr);
        console.error(
          "[getAllCourses] Fallback query failed:",
          innerNorm.code,
          innerNorm.message
        );
        return {
          success: false,
          error: innerNorm.code,
          message: innerNorm.message,
        };
      }
    }

    return { success: false, error: norm.code, message: norm.message };
  }
};

/**
 * Get course by ID
 */
export const getCourseById = async (courseId) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);

    if (courseSnap.exists()) {
      return {
        success: true,
        data: mapCourseToV2({ id: courseSnap.id, ...courseSnap.data() }),
      };
    } else {
      return { success: false, error: "Course not found" };
    }
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error fetching course:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Create new course (Admin only)
 */
export const createCourse = async (courseData) => {
  try {
    validateCourseData(courseData);

    const coursePayload = {
      ...courseData,
      totalEnrollments: 0,
      averageRating: 0,
      totalRatings: 0,
      isPublished: false,
      isFeatured: false,
      status: "draft",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "courses"), coursePayload);
    return { success: true, data: { id: docRef.id, ...coursePayload } };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error creating course:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Update course (Admin only)
 */
export const updateCourse = async (courseId, updateData) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    const updatePayload = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(courseRef, updatePayload);
    return { success: true };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error updating course:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};
