import { db } from '../../db/index.js';
import { enrollments, certifications } from '../../db/schema.js';
import { and, eq, desc } from 'drizzle-orm';

export const findByUser = async (userId) =>
  db.select().from(enrollments).where(eq(enrollments.userId, userId));

export const findByUserAndCourse = async (userId, courseId) => {
  const [record] = await db.select().from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
    .limit(1);
  return record || null;
};

export const findById = async (id) => {
  const [record] = await db.select().from(enrollments).where(eq(enrollments.id, id)).limit(1);
  return record || null;
};

export const findAll = async ({ userId, courseId, status, limit } = {}) => {
  const filters = [];
  if (userId) filters.push(eq(enrollments.userId, userId));
  if (courseId) filters.push(eq(enrollments.courseId, courseId));
  if (status) filters.push(eq(enrollments.status, String(status).toUpperCase()));

  let query = db.select().from(enrollments).orderBy(desc(enrollments.enrolledAt));
  if (filters.length === 1) query = query.where(filters[0]);
  else if (filters.length > 1) query = query.where(and(...filters));

  const n = Number.parseInt(limit, 10);
  if (Number.isFinite(n) && n > 0) query = query.limit(n);
  return query;
};

export const create = async (data) => {
  await db.insert(enrollments).values(data).execute();
  return findById(data.id);
};

export const update = async (id, data) => {
  await db.update(enrollments).set(data).where(eq(enrollments.id, id)).execute();
  return findById(id);
};

export const remove = async (id) => {
  await db.delete(enrollments).where(eq(enrollments.id, id)).execute();
};

export const findCertification = async (userId, courseId) => {
  const [cert] = await db.select().from(certifications)
    .where(and(eq(certifications.userId, userId), eq(certifications.courseId, courseId)))
    .limit(1);
  return cert || null;
};

export const createCertification = async (data) => {
  await db.insert(certifications).values(data).execute();
};
