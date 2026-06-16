import { db } from '../../db/index.js';
import { certifications } from '../../db/schema.js';
import { and, eq, desc } from 'drizzle-orm';

export const findAll = async ({ userId, courseId, status, limit, isAdmin, requestingUserId } = {}) => {
  const filters = [];
  if (!isAdmin) {
    filters.push(eq(certifications.userId, String(requestingUserId)));
  } else if (userId) {
    filters.push(eq(certifications.userId, String(userId)));
  }
  if (courseId) filters.push(eq(certifications.courseId, String(courseId)));
  if (status) filters.push(eq(certifications.status, String(status).toUpperCase()));

  let query = db.select().from(certifications).orderBy(desc(certifications.createdAt));
  if (filters.length === 1) query = query.where(filters[0]);
  else if (filters.length > 1) query = query.where(and(...filters));

  const n = Number.parseInt(limit, 10);
  if (Number.isFinite(n) && n > 0) query = query.limit(n);
  return query;
};

export const findById = async (id) => {
  const [cert] = await db.select().from(certifications).where(eq(certifications.id, id)).limit(1);
  return cert || null;
};

export const create = async (data) => {
  await db.insert(certifications).values(data).execute();
  return findById(data.id);
};

export const update = async (id, data) => {
  await db.update(certifications).set(data).where(eq(certifications.id, id)).execute();
  return findById(id);
};

export const remove = async (id) => {
  await db.delete(certifications).where(eq(certifications.id, id)).execute();
};
