import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase";
import { validateCouponData } from "../schema";
import { normalizeFirestoreError } from "./mappers";
import { serverTimestamp, increment } from "firebase/firestore";

// ============================================================================
// COUPON OPERATIONS
// ============================================================================

/**
 * Get all active coupons
 */
export const getAllActiveCoupons = async () => {
  try {
    const couponsRef = collection(db, "coupons");
    const q = query(
      couponsRef,
      where("isActive", "==", true),
      where("validUntil", ">", new Date()),
      orderBy("validUntil", "asc")
    );

    const snapshot = await getDocs(q);
    const coupons = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return { success: true, data: coupons };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.warn("[getAllActiveCoupons]", norm.code, norm.message);
    if (norm.code === "INDEX_REQUIRED") {
      try {
        const now = new Date();
        const fallbackQ = query(
          collection(db, "coupons"),
          where("isActive", "==", true)
        );
        const snap = await getDocs(fallbackQ);
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const getDate = (v) =>
          v && typeof v.toDate === "function"
            ? v.toDate()
            : v instanceof Date
            ? v
            : null;
        const filtered = all
          .filter((c) => {
            const v = getDate(c.validUntil);
            return v && v > now;
          })
          .sort((a, b) => {
            const va = getDate(a.validUntil);
            const vb = getDate(b.validUntil);
            return va && vb ? va - vb : 0;
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
          "[getAllActiveCoupons] Fallback failed:",
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
 * Validate coupon code
 */
export const validateCouponCode = async (couponCode, courseId, userId) => {
  try {
    const couponRef = doc(db, "coupons", couponCode.toUpperCase());
    const couponSnap = await getDoc(couponRef);

    if (!couponSnap.exists()) {
      return { success: false, error: "Invalid coupon code" };
    }

    const coupon = couponSnap.data();
    const now = new Date();

    // Check if coupon is active
    if (!coupon.isActive) {
      return { success: false, error: "Coupon is not active" };
    }

    // Check validity period
    if (coupon.validFrom && now < coupon.validFrom.toDate()) {
      return { success: false, error: "Coupon is not yet valid" };
    }

    if (coupon.validUntil && now > coupon.validUntil.toDate()) {
      return { success: false, error: "Coupon has expired" };
    }

    // Check usage limits
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return { success: false, error: "Coupon usage limit exceeded" };
    }

    // Check course applicability
    if (coupon.applicableCourses && coupon.applicableCourses.length > 0) {
      if (!coupon.applicableCourses.includes(courseId)) {
        return {
          success: false,
          error: "Coupon not applicable for this course",
        };
      }
    }

    return { success: true, data: coupon };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error validating coupon:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Apply coupon and update usage count
 */
export const applyCoupon = async (couponCode, courseId, userId) => {
  try {
    const validation = await validateCouponCode(couponCode, courseId, userId);

    if (!validation.success) {
      return validation;
    }

    const couponRef = doc(db, "coupons", couponCode.toUpperCase());
    await updateDoc(couponRef, {
      usedCount: increment(1),
      totalOrders: increment(1),
      updatedAt: serverTimestamp(),
    });

    return { success: true, data: validation.data };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error applying coupon:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Create coupon (Admin only)
 */
export const createCoupon = async (couponData) => {
  try {
    validateCouponData(couponData);

    const couponPayload = {
      ...couponData,
      code: couponData.code.toUpperCase(),
      usedCount: 0,
      totalDiscountGiven: 0,
      totalOrders: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "coupons"), couponPayload);
    return { success: true, data: { id: docRef.id, ...couponPayload } };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error creating coupon:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Update coupon (Admin only)
 */
export const updateCoupon = async (couponId, updateData) => {
  try {
    const couponRef = doc(db, "coupons", couponId);
    const updatePayload = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(couponRef, updatePayload);
    return { success: true };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error updating coupon:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Delete coupon (Admin only)
 */
export const deleteCoupon = async (couponId) => {
  try {
    const couponRef = doc(db, "coupons", couponId);
    await deleteDoc(couponRef);
    return { success: true };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error deleting coupon:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};
