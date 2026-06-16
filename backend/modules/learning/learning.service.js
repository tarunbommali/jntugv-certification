import { randomUUID } from 'crypto';
import * as LearningRepo from './learning.repository.js';
import * as CoursesRepo from '../catalog/catalog.repository.js';
import { sendEnrollmentEmail } from '../../modules/notifications/notification.service.js';

const toISODate = (v) => {
  if (!v) return v;
  if (v instanceof Date) return v.toISOString();
  try { const d = new Date(v); if (!Number.isNaN(d.getTime())) return d.toISOString(); } catch { /* ignore */ }
  return v;
};

export const sanitizeTaskProgress = (rawProgress = {}, { fallback = {}, reviewer } = {}) => {
  const source = rawProgress && typeof rawProgress === 'object' ? rawProgress : {};
  const prev = fallback && typeof fallback === 'object' ? fallback : {};

  const toInt = (v, d = 0) => { const n = Number.parseInt(v, 10); return Number.isFinite(n) ? Math.max(0, n) : d; };

  const totalTasks = toInt(source.totalTasks ?? source.total ?? prev.totalTasks ?? 0);
  const completedTasks = Math.min(totalTasks, toInt(source.completedTasks ?? source.completed ?? prev.completedTasks ?? 0));
  const completionFromCount = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const completionSource = Number(source.completionPercentage ?? prev.completionPercentage ?? completionFromCount);
  const completionPercentage = Number.isFinite(completionSource) ? Math.max(0, Math.min(100, completionSource)) : Math.max(0, Math.min(100, completionFromCount));

  const validated = Boolean(source.validated ?? source.manualValidation ?? prev.validated ?? false);
  const manualNotesRaw = source.manualNotes ?? prev.manualNotes ?? null;
  const manualNotes = typeof manualNotesRaw === 'string' ? manualNotesRaw.trim().slice(0, 2000) || null : null;
  const validatedAt = validated ? toISODate(source.validatedAt ?? prev.validatedAt) || new Date().toISOString() : null;
  const validatedBy = validated ? (source.validatedBy || reviewer?.id || reviewer?.email || prev.validatedBy || null) : null;

  return { totalTasks, completedTasks, completionPercentage: Number(completionPercentage.toFixed(2)), validated, manualNotes, validatedAt, validatedBy };
};

export const normalizeEnrollment = (record) => {
  if (!record) return null;
  const paymentDetails = record.billingInfo || {};
  const paidAmount = Number(paymentDetails.amountPaid ?? paymentDetails.amount ?? record.amount ?? 0);
  const taskProgress = sanitizeTaskProgress(record.taskProgress, { fallback: record.taskProgress });
  const normalized = {
    ...record,
    enrolledAt: toISODate(record.enrolledAt),
    completedAt: toISODate(record.completedAt),
    updatedAt: toISODate(record.updatedAt),
    paymentDetails,
    paidAmount,
    taskProgress,
    certificateUnlockedAt: toISODate(record.certificateUnlockedAt),
    certificateDownloadable: Boolean(record.certificateDownloadable),
  };
  delete normalized.billingInfo;
  return normalized;
};

const maybeTriggerCertification = async (userId, courseId, enrollmentId, existingTaskProgress, updatedTaskProgress, completionPercentage) => {
  const existingCert = await LearningRepo.findCertification(userId, courseId);
  if (existingCert) return; // Idempotent — one cert per user per course

  const certId = randomUUID();
  const certNo = `CERT-${Date.now()}-${randomUUID().slice(0, 4)}`.toUpperCase();
  const vCode = randomUUID().replace(/-/g, '').slice(0, 16);

  await LearningRepo.createCertification({
    id: certId, userId, courseId, enrollmentId,
    status: 'PENDING', certificateNo: certNo, verificationCode: vCode,
    overallScore: 0, completionPercentage,
    taskProgress: updatedTaskProgress || existingTaskProgress || {},
    createdAt: new Date(), updatedAt: new Date(),
  });
};

export const getMyEnrollments = async (userId) => {
  const rows = await LearningRepo.findByUser(userId);
  return rows.map(normalizeEnrollment);
};

export const getByUserAndCourse = async (userId, courseId) => {
  const record = await LearningRepo.findByUserAndCourse(userId, courseId);
  return normalizeEnrollment(record);
};

export const getAllEnrollments = async (filters) => {
  const rows = await LearningRepo.findAll(filters);
  return rows.map(normalizeEnrollment);
};

export const getEnrollmentById = async (id) => {
  const record = await LearningRepo.findById(id);
  if (!record) throw Object.assign(new Error('Enrollment not found'), { statusCode: 404 });
  return normalizeEnrollment(record);
};

export const createEnrollment = async (body, requestingUser, { paymentVerified = false } = {}) => {
  const { courseId, paymentData = {}, ...enrollmentData } = body;

  const requestedUserId = enrollmentData.userId && enrollmentData.userId !== requestingUser.id
    ? (requestingUser.isAdmin ? enrollmentData.userId : null)
    : requestingUser.id;

  if (!requestedUserId) throw Object.assign(new Error('Not authorized to enroll this user'), { statusCode: 403 });

  const targetCourse = await CoursesRepo.findById(courseId);
  if (!targetCourse) throw Object.assign(new Error('Course not found'), { statusCode: 404 });
  if (targetCourse.status !== 'published') throw Object.assign(new Error('Cannot enroll in an inactive course'), { statusCode: 400 });

  const coursePrice = Math.max(0, Number(targetCourse.price) || 0);
  if (!requestingUser.isAdmin && coursePrice > 0 && !paymentVerified) {
    throw Object.assign(new Error('A verified payment is required for this course'), { statusCode: 402 });
  }

  const existing = await LearningRepo.findByUserAndCourse(requestedUserId, courseId);
  if (existing) throw Object.assign(new Error('Already enrolled in this course'), { statusCode: 400 });

  const enrollmentId = randomUUID();
  const status = (enrollmentData.status || 'ACTIVE').toUpperCase();
  const paymentMethod = (paymentData.method || '').toLowerCase();
  const resolvedAmount = Number(paymentData.amount ?? paymentData.amountPaid ?? enrollmentData.coursePrice ?? 0);

  const baseTaskProgress = sanitizeTaskProgress(enrollmentData.taskProgress, { reviewer: requestingUser });
  const certificateDownloadable = baseTaskProgress.validated && baseTaskProgress.completionPercentage >= 90;

  const values = {
    id: enrollmentId, userId: requestedUserId, courseId, status,
    courseTitle: enrollmentData.courseTitle || targetCourse.title,
    enrolledAt: enrollmentData.enrollmentDate ? new Date(enrollmentData.enrollmentDate) : new Date(),
    completedAt: enrollmentData.completedAt ? new Date(enrollmentData.completedAt) : null,
    paymentId: paymentData.paymentId,
    amount: resolvedAmount,
    currency: paymentData.currency || enrollmentData.currency || 'INR',
    couponCode: paymentData.couponCode || enrollmentData.couponCode,
    couponDiscount: Number(paymentData.couponDiscount ?? enrollmentData.couponDiscount ?? 0),
    billingInfo: { ...paymentData, amountPaid: resolvedAmount, method: paymentMethod || 'offline', enrolledBy: requestingUser.isAdmin ? 'admin' : 'user' },
    taskProgress: baseTaskProgress,
    certificateDownloadable,
    certificateUnlockedAt: certificateDownloadable ? new Date() : null,
  };

  if (enrollmentData.progress) values.progress = enrollmentData.progress;
  if (enrollmentData.moduleProgress) values.moduleProgress = enrollmentData.moduleProgress;

  const created = await LearningRepo.create(values);

  // Fire-and-forget enrollment email for admin-enrolled users
  if (requestingUser.isAdmin && requestedUserId !== requestingUser.id && status === 'ACTIVE') {
    (async () => {
      try {
        const { db } = await import('../../db/index.js');
        const { users } = await import('../../db/schema.js');
        const { eq } = await import('drizzle-orm');
        const [u] = await db.select().from(users).where(eq(users.id, requestedUserId)).limit(1);
        if (u?.email) {
          await sendEnrollmentEmail({ email: u.email, userName: u.username || u.firstName || 'Student', courseTitle: created.courseTitle, enrolledBy: requestingUser.email });
        }
      } catch { /* non-critical */ }
    })();
  }

  return normalizeEnrollment(created);
};

export const updateEnrollment = async (id, body, requestingUser) => {
  const existing = await LearningRepo.findById(id);
  if (!existing) throw Object.assign(new Error('Enrollment not found'), { statusCode: 404 });
  if (existing.userId !== requestingUser.id && !requestingUser.isAdmin) throw Object.assign(new Error('Not authorized'), { statusCode: 403 });

  const updates = {};
  
  // Admin-only fields (Mass Assignment Prevention - SEC-06)
  if (requestingUser.isAdmin) {
    if (body.status) updates.status = String(body.status).toUpperCase();
    if (body.paidAmount !== undefined) updates.amount = Number(body.paidAmount);
    if (body.paymentDetails) updates.billingInfo = { ...existing.billingInfo, ...body.paymentDetails };
    if (body.progress) updates.progress = body.progress;
    if (body.moduleProgress) updates.moduleProgress = body.moduleProgress;
  }

  let shouldTriggerCert = false;
  let finalCompletion = 0;

  if (body.taskProgress) {
    const sanitized = sanitizeTaskProgress(body.taskProgress, { fallback: existing.taskProgress, reviewer: requestingUser });
    
    // Only admins can validate task progress
    if (!requestingUser.isAdmin && !existing.taskProgress?.validated) {
      sanitized.validated = false;
      sanitized.validatedAt = null;
      sanitized.validatedBy = null;
    }

    const certificateDownloadable = sanitized.validated && sanitized.completionPercentage >= 90;
    updates.taskProgress = sanitized;
    updates.certificateDownloadable = certificateDownloadable;
    updates.certificateUnlockedAt = certificateDownloadable ? (existing.certificateUnlockedAt || new Date()) : null;
    if (sanitized.completionPercentage >= 90 && sanitized.validated) { shouldTriggerCert = true; finalCompletion = sanitized.completionPercentage; }
  }

  // Admin override for video completion
  if (requestingUser.isAdmin && body.completionPercentage !== undefined) {
    const vidCompletion = Number(body.completionPercentage);
    if (Number.isFinite(vidCompletion) && vidCompletion >= 90) {
      shouldTriggerCert = true; finalCompletion = vidCompletion;
      if (!updates.certificateDownloadable && !existing.certificateDownloadable) {
        updates.certificateDownloadable = true;
        updates.certificateUnlockedAt = new Date();
      }
    }
  }

  if (shouldTriggerCert) await maybeTriggerCertification(existing.userId, existing.courseId, existing.id, existing.taskProgress, updates.taskProgress, finalCompletion);

  updates.updatedAt = new Date();
  const updated = await LearningRepo.update(id, updates);
  return normalizeEnrollment(updated);
};

export const deleteEnrollment = async (id, requestingUser) => {
  const existing = await LearningRepo.findById(id);
  if (!existing) throw Object.assign(new Error('Enrollment not found'), { statusCode: 404 });
  if (existing.userId !== requestingUser.id && !requestingUser.isAdmin) throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  await LearningRepo.remove(id);
};

// Progress helpers
export const getProgress = async (userId, courseId) => {
  const enrollment = await LearningRepo.findByUserAndCourse(userId, courseId);
  if (!enrollment) throw Object.assign(new Error('Enrollment not found'), { statusCode: 404 });
  return enrollment.progress || {};
};

export const updateProgress = async (userId, courseId, progressUpdate) => {
  const existing = await LearningRepo.findByUserAndCourse(userId, courseId);
  if (!existing) throw Object.assign(new Error('Enrollment not found'), { statusCode: 404 });

  // SEC-01 Fix: Never trigger certifications based on client-submitted completion percentage.
  // Certifications must be triggered securely via assessments or admin validation.
  const updates = { progress: progressUpdate, updatedAt: new Date() };

  await LearningRepo.update(existing.id, updates);
  return progressUpdate;
};
