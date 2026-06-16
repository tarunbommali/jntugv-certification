import { db } from '../../db/index.js';
import { courses, coursePassingRules } from '../../db/schema.js';
import { and, eq, ilike, desc } from 'drizzle-orm';

export const findAll = async ({ category, featured, q, limit, includeDrafts } = {}) => {
  const conditions = [];
  if (!includeDrafts) conditions.push(eq(courses.isPublished, true));
  if (category) conditions.push(ilike(courses.category, `%${category}%`));
  if (featured) conditions.push(eq(courses.isFeatured, String(featured).toLowerCase() === 'true'));
  if (q) conditions.push(ilike(courses.title, `%${q}%`));

  let query = db.select().from(courses).orderBy(desc(courses.createdAt));
  if (conditions.length === 1) query = query.where(conditions[0]);
  else if (conditions.length > 1) query = query.where(and(...conditions));

  const numericLimit = Number.parseInt(limit, 10);
  if (Number.isFinite(numericLimit) && numericLimit > 0) query = query.limit(numericLimit);

  return query;
};

export const findById = async (id) => {
  const [course] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!course) return null;
  
  const [passingRules] = await db.select().from(coursePassingRules).where(eq(coursePassingRules.courseId, id)).limit(1);
  if (passingRules) {
    course.passingRules = passingRules;
  }
  
  return course;
};

export const create = async (data) => {
  await db.insert(courses).values(data).execute();
  return findById(data.id);
};

export const update = async (id, data) => {
  await db.update(courses).set(data).where(eq(courses.id, id)).execute();
  return findById(id);
};

export const remove = async (id) => {
  await db.delete(courses).where(eq(courses.id, id));
};

import { courseReviews, enrollments } from '../../db/schema.js';
import { sql } from 'drizzle-orm';

export const checkEnrollment = async (courseId, userId) => {
  const [enrollment] = await db.select().from(enrollments).where(and(eq(enrollments.courseId, courseId), eq(enrollments.userId, userId))).limit(1);
  return !!enrollment;
};

export const createReview = async (reviewData) => {
  await db.insert(courseReviews).values(reviewData).onDuplicateKeyUpdate({
    set: {
      rating: reviewData.rating,
      review: reviewData.review,
      updatedAt: sql`CURRENT_TIMESTAMP`,
    }
  });
  return getReviews(reviewData.courseId);
};

export const getReviews = async (courseId) => {
  return db.select().from(courseReviews).where(eq(courseReviews.courseId, courseId)).orderBy(desc(courseReviews.createdAt));
};

export const updateCourseStats = async (courseId) => {
  const result = await db.select({
    avgRating: sql`AVG(${courseReviews.rating})`,
    totalReviews: sql`COUNT(${courseReviews.id})`,
  }).from(courseReviews).where(eq(courseReviews.courseId, courseId));
  
  const stats = result[0] || { avgRating: 0, totalReviews: 0 };
  const avg = Number(stats.avgRating) || 0;
  const count = Number(stats.totalReviews) || 0;
  
  await db.update(courses).set({
    averageRating: avg,
    totalRatings: count,
  }).where(eq(courses.id, courseId));
  
  return { averageRating: avg, totalRatings: count };
};
