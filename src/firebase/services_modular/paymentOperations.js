import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { normalizeFirestoreError } from "./mappers";

// ============================================================================
// PAYMENT OPERATIONS
// ============================================================================

/**
 * Create payment record
 */
export const createPaymentRecord = async (paymentData) => {
  try {
    const paymentPayload = {
      ...paymentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "payments"), paymentPayload);
    return { success: true, data: { id: docRef.id, ...paymentPayload } };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error creating payment record:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (
  paymentId,
  status,
  additionalData = {}
) => {
  try {
    const paymentRef = doc(db, "payments", paymentId);
    const updatePayload = {
      status,
      updatedAt: serverTimestamp(),
      ...additionalData,
    };

    if (status === "captured") {
      updatePayload.capturedAt = serverTimestamp();
    }

    await updateDoc(paymentRef, updatePayload);
    return { success: true };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.error("Error updating payment status:", norm);
    return { success: false, error: norm.message || norm.code };
  }
};

/**
 * Get user payment history
 */
export const getUserPaymentHistory = async (userId) => {
  try {
    const paymentsRef = collection(db, "payments");
    const q = query(
      paymentsRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const payments = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return { success: true, data: payments };
  } catch (error) {
    const norm = normalizeFirestoreError(error);
    console.warn("[getUserPaymentHistory]", norm.code, norm.message);
    if (norm.code === "INDEX_REQUIRED") {
      try {
        const fallbackQ = query(
          collection(db, "payments"),
          where("userId", "==", userId)
        );
        const snap = await getDocs(fallbackQ);
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const sorted = all.sort((a, b) => {
          const ta = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : a.createdAt || 0;
          const tb = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : b.createdAt || 0;
          return tb - ta;
        });

        return {
          success: true,
          data: sorted,
          fallback: true,
          indexRequired: true,
          indexMessage: norm.message,
        };
      } catch (innerErr) {
        const inner = normalizeFirestoreError(innerErr);
        console.error(
          "[getUserPaymentHistory] Fallback failed:",
          inner.code,
          inner.message
        );
        return { success: false, error: inner.code, message: inner.message };
      }
    }

    return { success: false, error: norm.code, message: norm.message };
  }
};

export default {
  // Payment operations
  createPaymentRecord,
  updatePaymentStatus,
  getUserPaymentHistory,
};
