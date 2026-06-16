import { db } from '../../db/index.js';
import { payments, paymentLogs } from '../../db/schema.js';
import { and, eq, desc } from 'drizzle-orm';

export const findAll = async ({ userId, courseId, status, limit } = {}) => {
  const filters = [];
  if (userId) filters.push(eq(payments.userId, userId));
  if (courseId) filters.push(eq(payments.courseId, courseId));
  if (status) filters.push(eq(payments.status, String(status).toUpperCase()));

  let query = db.select().from(payments).orderBy(desc(payments.createdAt));
  if (filters.length === 1) query = query.where(filters[0]);
  else if (filters.length > 1) query = query.where(and(...filters));

  const n = Number.parseInt(limit, 10);
  if (Number.isFinite(n) && n > 0) query = query.limit(n);
  return query;
};

export const findByUser = async (userId) =>
  db.select().from(payments).where(eq(payments.userId, userId));

export const findByPaymentId = async (paymentId) => {
  const [p] = await db.select().from(payments).where(eq(payments.paymentId, paymentId)).limit(1);
  return p || null;
};

export const findByOrderId = async (orderId) => {
  const [p] = await db.select().from(payments).where(eq(payments.orderId, orderId)).limit(1);
  return p || null;
};

export const findById = async (id) => {
  const [p] = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
  return p || null;
};

export const create = async (data) => {
  await db.insert(payments).values(data).execute();
  return findById(data.id);
};

export const update = async (paymentId, data) => {
  await db.update(payments).set(data).where(eq(payments.paymentId, paymentId)).execute();
  return findByPaymentId(paymentId);
};

export const updateById = async (id, data) => {
  await db.update(payments).set(data).where(eq(payments.id, id)).execute();
  return findById(id);
};

export const findWebhookLog = async (paymentId, event) => {
  const [log] = await db.select().from(paymentLogs)
    .where(and(eq(paymentLogs.paymentId, paymentId), eq(paymentLogs.event, event)))
    .limit(1);
  return log || null;
};

export const createWebhookLog = async (data) => {
  await db.insert(paymentLogs).values(data).execute();
};
