import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const findByEmail = async (email) => {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user || null;
};

export const findByUsername = async (username) => {
  const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return user || null;
};

export const findById = async (id) => {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user || null;
};

export const findByResetToken = async (hashedToken) => {
  const [user] = await db.select().from(users).where(eq(users.passwordResetToken, hashedToken)).limit(1);
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
