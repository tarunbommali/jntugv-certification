// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Create enrollment with payment record in batch
 */
export const createEnrollmentWithPayment = async (
  enrollmentData,
  paymentData
) => {
  try {
    const batch = writeBatch(db);

    // Create enrollment
    const enrollmentRef = doc(collection(db, "enrollments"));
    const enrollmentPayload = {
      enrollmentId: enrollmentRef.id,
      userId: enrollmentData.userId,
      courseId: enrollmentData.courseId,
      courseTitle: enrollmentData.courseTitle,
      status: enrollmentData.status ?? "SUCCESS",
      paidAmount: paymentData?.amount,
      enrolledAt: serverTimestamp(),
      paymentDetails: {
        paymentId: paymentData?.paymentId ?? "",
        paymentDate: serverTimestamp(),
      },
    };
    batch.set(enrollmentRef, enrollmentPayload);

    // Create payment record
    const paymentRef = doc(collection(db, "payments"));
    const paymentPayload = {
      ...paymentData,
      enrollmentId: enrollmentRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    batch.set(paymentRef, paymentPayload);

    // Update course enrollment count
    const courseRef = doc(db, "courses", enrollmentData.courseId);
    batch.update(courseRef, {
      totalEnrollments: increment(1),
    });

    // Update user enrollment count
    const userRef = doc(db, "users", enrollmentData.userId);
    batch.update(userRef, {
      totalCoursesEnrolled: increment(1),
    });

    await batch.commit();

    return {
      success: true,
      data: {
        enrollmentId: enrollmentRef.id,
        paymentId: paymentRef.id,
      },
    };
  } catch (error) {
    console.error("Error creating enrollment with payment:", error);
    return { success: false, error: error.message };
  }
};

export default {
  // Batch operations
  createEnrollmentWithPayment,
};
