import { db } from '../../db/index.js';
import { users, enrollments } from '../../db/schema.js';
import { eq, desc, or, like } from 'drizzle-orm';

export const findAll = async (limit, searchTerm) => {
  let query = db.select().from(users);

  if (searchTerm) {
    const searchPattern = `%${searchTerm}%`;
    query = query.where(
      or(
        like(users.username, searchPattern),
        like(users.email, searchPattern),
        like(users.id, searchPattern)
      )
    );
  }

  query = query.orderBy(desc(users.createdAt));

  if (limit && Number.isFinite(limit) && limit > 0) {
    query = query.limit(limit);
  }

  return query;
};

export const findById = async (id) => {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user || null;
};

export const findByEmail = async (email) => {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user || null;
};

export const createUser = async (data) => {
  await db.insert(users).values(data).execute();
  return findById(data.id);
};

export const updateUser = async (id, data) => {
  await db.update(users).set(data).where(eq(users.id, id)).execute();
  return findById(id);
};

export const getEnrollmentsByUser = async (userId) => {
  return db.select().from(enrollments).where(eq(enrollments.userId, userId));
};
