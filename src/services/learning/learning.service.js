import { enrollmentsApi, progressApi } from '../../api/index.js';
import { extractData, success, failure } from '../shared/response.js';
import { createPaymentRecord } from '../payments/payments.service.js';

export const createEnrollment = async (payload) => {
  try {
    const response = await enrollmentsApi.createEnrollment(payload);
    const enrollment = extractData(response);
    return success(enrollment);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const createEnrollmentWithPayment = async (enrollmentPayload, paymentPayload = {}) => {
  try {
    const enrollmentResult = await createEnrollment(enrollmentPayload);
    if (!enrollmentResult.success) {
      return enrollmentResult;
    }

    const paymentResult = await createPaymentRecord({
      ...paymentPayload,
      courseId: enrollmentPayload.courseId,
      enrollmentId: enrollmentResult.data?.id || paymentPayload.enrollmentId,
    });

    if (!paymentResult.success) {
      return paymentResult;
    }

    return success({
      enrollment: enrollmentResult.data,
      payment: paymentResult.data,
    });
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const getUserEnrollments = async (userId) => {
  try {
    const response = userId
      ? await enrollmentsApi.getUserEnrollments(userId)
      : await enrollmentsApi.getMyEnrollments();
    const enrollments = extractData(response);
    return success(enrollments);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const getAllEnrollments = async (params) => {
  try {
    const response = await enrollmentsApi.getAllEnrollments(params);
    const enrollments = extractData(response);
    return success(Array.isArray(enrollments) ? enrollments : []);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const getEnrollmentById = async (enrollmentId) => {
  try {
    const response = await enrollmentsApi.getEnrollmentById(enrollmentId);
    const enrollment = extractData(response);
    return success(enrollment);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const updateEnrollment = async (enrollmentId, payload) => {
  try {
    const response = await enrollmentsApi.updateEnrollment(enrollmentId, payload);
    const updated = extractData(response);
    return success(updated);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const deleteEnrollment = async (enrollmentId) => {
  try {
    await enrollmentsApi.deleteEnrollment(enrollmentId);
    return success(true);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const checkUserEnrollment = async (_userId, courseId) => {
  try {
    const response = await enrollmentsApi.checkUserEnrollment(courseId);
    const enrollment = extractData(response);
    return success({
      isEnrolled: Boolean(enrollment),
      enrollment,
    });
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const updateEnrollmentProgress = async (enrollmentId, payload) => {
  try {
    const response = await enrollmentsApi.updateEnrollment(enrollmentId, { progress: payload });
    const updated = extractData(response);
    return success(updated);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const getUserEnrollmentStats = async (userId) => {
  try {
    const response = await enrollmentsApi.getUserEnrollmentStats(userId);
    const stats = extractData(response);
    return success(stats);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const getUserProgress = async (_userId, courseId) => {
  try {
    const response = await progressApi.getUserProgress(courseId);
    const progress = extractData(response);
    if (!progress) {
      return failure('Progress not found');
    }
    return success(progress);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const updateUserProgress = async (_userId, courseId, payload) => {
  try {
    const response = await progressApi.updateUserProgress(courseId, payload);
    const progress = extractData(response);
    return success(progress);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const getSecureVideoAccessUrl = async (_userId, courseId, payload) => {
  try {
    const response = await progressApi.getSecureVideoAccessUrl(courseId, payload);
    const result = extractData(response);
    return success(result);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};
