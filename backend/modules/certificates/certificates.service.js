import { randomUUID } from 'crypto';
import * as CertRepo from './certificates.repository.js';
import * as UsersRepo from '../users/users.repository.js';
import * as LearningRepo from '../learning/learning.repository.js';
import { sendCertificateIssuedEmail } from '../../modules/notifications/notification.service.js';

const toISODate = (v) => {
  if (!v) return v;
  if (v instanceof Date) return v.toISOString();
  try { const d = new Date(v); if (!Number.isNaN(d.getTime())) return d.toISOString(); } catch { /* ignore */ }
  return v;
};

const clamp = (v, min, max) => (Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : min);
const toNum = (v, fallback = 0) => { const n = Number(v); return Number.isFinite(n) ? n : fallback; };

const sanitizeTaskProgress = (progress = {}, reviewer = {}) => {
  const source = progress && typeof progress === 'object' ? progress : {};
  const toInt = (raw, d = 0) => { const p = Number.parseInt(raw, 10); return Number.isFinite(p) ? Math.max(0, p) : d; };
  const totalTasks = toInt(source.totalTasks ?? source.total ?? 0);
  const completedRaw = toInt(source.completedTasks ?? source.completed ?? 0);
  const completedTasks = totalTasks > 0 ? Math.min(totalTasks, completedRaw) : completedRaw;
  const completionFromCount = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const completionSource = Number(source.completionPercentage ?? source.percent ?? completionFromCount);
  const completionPercentage = clamp(Number.isFinite(completionSource) ? completionSource : completionFromCount, 0, 100);
  const validated = Boolean(source.validated ?? source.isValidated ?? false);
  const manualNotes = typeof source.manualNotes === 'string' ? source.manualNotes.trim().slice(0, 2000) || null : null;
  const validatedAt = validated ? toISODate(source.validatedAt) || new Date().toISOString() : null;
  const validatedBy = validated ? (source.validatedBy || reviewer?.id || reviewer?.email || null) : null;
  return { totalTasks, completedTasks, completionPercentage: Number(completionPercentage.toFixed(2)), validated, manualNotes, validatedAt, validatedBy };
};

export const normalizeCertification = (record) => {
  if (!record) return null;
  const taskProgress = sanitizeTaskProgress(record.taskProgress, { validatedBy: record.taskProgress?.validatedBy });
  return {
    ...record,
    overallScore: toNum(record.overallScore),
    completionPercentage: toNum(record.completionPercentage || taskProgress.completionPercentage, taskProgress.completionPercentage),
    issuedAt: toISODate(record.issuedAt),
    expiresAt: toISODate(record.expiresAt),
    reviewedAt: toISODate(record.reviewedAt),
    createdAt: toISODate(record.createdAt),
    updatedAt: toISODate(record.updatedAt),
    validated: Boolean(record.validated),
    taskProgress,
    metadata: record.metadata && Object.keys(record.metadata).length > 0 ? record.metadata : null,
  };
};

export const listCertifications = async (query, user) => {
  const rows = await CertRepo.findAll({ ...query, isAdmin: user.isAdmin, requestingUserId: user.id });
  return rows.map(normalizeCertification);
};

export const getCertificationById = async (id, requestingUser) => {
  const record = await CertRepo.findById(id);
  if (!record) throw Object.assign(new Error('Certification not found'), { statusCode: 404 });
  if (record.userId !== requestingUser.id && !requestingUser.isAdmin) throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  
  if (!requestingUser.isAdmin) {
    const enrollment = await LearningRepo.findByUserAndCourse(record.userId, record.courseId);
    if (!enrollment || enrollment.status !== 'ACTIVE') {
      throw Object.assign(new Error('You must be actively enrolled to view or download this certificate.'), { statusCode: 403 });
    }
    if (!enrollment.certificateDownloadable) {
      throw Object.assign(new Error('Certificate is not yet downloadable. Please complete the course requirements.'), { statusCode: 403 });
    }
  }

  return normalizeCertification(record);
};

export const createCertification = async (body, reviewer) => {
  const { userId, courseId, enrollmentId, status = 'PENDING', overallScore = 0, completionPercentage = 0, taskProgress = {}, validated = false, reviewerNotes = null, certificateUrl = null, issuedAt = null, expiresAt = null, issuedBy = null, metadata = null } = body;

  if (!userId || !courseId) throw Object.assign(new Error('userId and courseId are required'), { statusCode: 400 });

  const sanitizedTaskProgress = sanitizeTaskProgress(taskProgress, reviewer);
  const now = new Date();
  const statusUpper = String(status).toUpperCase();
  const numericScore = clamp(Number(overallScore) || 0, 0, 100);
  const numericCompletion = clamp(Number(completionPercentage) || sanitizedTaskProgress.completionPercentage, 0, 100);
  const finalValidated = Boolean(validated || sanitizedTaskProgress.validated || numericCompletion >= 90);
  const resolvedIssuedAt = issuedAt ? new Date(issuedAt) : (statusUpper === 'ISSUED' ? now : null);
  const resolvedIssuedBy = issuedBy || reviewer?.id || reviewer?.email || (statusUpper === 'ISSUED' ? 'admin' : null);

  const record = {
    id: randomUUID(),
    userId: String(userId), courseId: String(courseId),
    enrollmentId: enrollmentId ? String(enrollmentId) : null,
    status: statusUpper, overallScore: numericScore, completionPercentage: numericCompletion,
    taskProgress: { ...sanitizedTaskProgress, validated: finalValidated },
    validated: finalValidated, reviewerNotes: reviewerNotes || null, certificateUrl: certificateUrl || null,
    issuedAt: resolvedIssuedAt, expiresAt: expiresAt ? new Date(expiresAt) : null,
    issuedBy: resolvedIssuedBy,
    reviewedBy: finalValidated ? (sanitizedTaskProgress.validatedBy || reviewer?.id || reviewer?.email || null) : null,
    reviewedAt: finalValidated ? now : null,
    metadata: metadata ?? null, createdAt: now, updatedAt: now,
  };

  const created = await CertRepo.create(record);
  return normalizeCertification(created);
};

export const updateCertification = async (id, body, reviewer) => {
  const existing = await CertRepo.findById(id);
  if (!existing) throw Object.assign(new Error('Certification not found'), { statusCode: 404 });

  if (existing.status === 'ISSUED' && body.status && body.status.toUpperCase() !== 'ISSUED') {
    throw Object.assign(new Error('Cannot modify an already issued certificate'), { statusCode: 400 });
  }

  const { status, overallScore, completionPercentage, taskProgress, validated, reviewerNotes, certificateUrl, issuedAt, expiresAt, issuedBy, metadata } = body;

  const updates = { updatedAt: new Date() };
  if (status !== undefined) updates.status = String(status).toUpperCase();
  if (overallScore !== undefined) updates.overallScore = clamp(Number(overallScore) || 0, 0, 100);
  if (completionPercentage !== undefined) updates.completionPercentage = clamp(Number(completionPercentage) || 0, 0, 100);
  if (reviewerNotes !== undefined) updates.reviewerNotes = reviewerNotes || null;
  if (certificateUrl !== undefined) updates.certificateUrl = certificateUrl || null;
  if (issuedAt !== undefined) updates.issuedAt = issuedAt ? new Date(issuedAt) : null;
  if (expiresAt !== undefined) updates.expiresAt = expiresAt ? new Date(expiresAt) : null;
  if (issuedBy !== undefined) updates.issuedBy = issuedBy || null;
  if (metadata !== undefined) updates.metadata = metadata;

  if (taskProgress !== undefined || validated !== undefined) {
    const sanitized = sanitizeTaskProgress(taskProgress ?? existing.taskProgress, reviewer);
    const finalValidated = validated !== undefined ? Boolean(validated) : sanitized.validated;
    updates.taskProgress = { ...sanitized, validated: finalValidated };
    updates.validated = finalValidated;
    if (updates.completionPercentage === undefined) updates.completionPercentage = clamp(sanitized.completionPercentage, 0, 100);
    updates.reviewedBy = finalValidated ? (sanitized.validatedBy || reviewer?.id || reviewer?.email || existing.reviewedBy || null) : null;
    updates.reviewedAt = finalValidated ? new Date() : null;
  }

  const nextStatus = updates.status || existing.status;
  if (nextStatus === 'ISSUED') {
    if (updates.issuedAt === undefined) updates.issuedAt = existing.issuedAt ? new Date(existing.issuedAt) : new Date();
    if (updates.issuedBy === undefined) updates.issuedBy = existing.issuedBy || reviewer?.id || reviewer?.email || 'admin';
  }

  const updated = await CertRepo.update(id, updates);

  // Send email on first issue
  if (existing.status !== 'ISSUED' && nextStatus === 'ISSUED') {
    UsersRepo.findById(updated.userId).then(async (certUser) => {
      if (certUser?.email) {
        await sendCertificateIssuedEmail({
          email: certUser.email,
          userName: certUser.username || certUser.firstName || 'Graduate',
          courseTitle: updated.metadata?.courseTitle || 'your course',
          certificateId: updated.id,
        }).catch(() => {});
      }
    }).catch(() => {});
  }

  return normalizeCertification(updated);
};

export const deleteCertification = async (id) => {
  const existing = await CertRepo.findById(id);
  if (!existing) throw Object.assign(new Error('Not found'), { statusCode: 404 });
  await CertRepo.remove(id);
};
