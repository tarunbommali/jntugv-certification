import { db } from '../../db/index.js';
import { courses, enrollments, payments, coupons } from '../../db/schema.js';
import { desc } from 'drizzle-orm';

export const getPublicData = async () => {
  const [allCourses, recentEnrollments, recentPayments, allCoupons] = await Promise.all([
    db.select().from(courses).orderBy(desc(courses.createdAt)),
    db.select().from(enrollments).orderBy(desc(enrollments.enrolledAt)).limit(25),
    db.select().from(payments).orderBy(desc(payments.createdAt)).limit(25),
    db.select().from(coupons).orderBy(desc(coupons.createdAt)),
  ]);

  const publishedCourses = allCourses.filter((c) => c.isPublished !== false);
  const featuredCourses = publishedCourses.filter((c) => c.isFeatured);
  const now = new Date();
  const activeCoupons = allCoupons.filter((c) => {
    if (!c.isActive) return false;
    if (c.validFrom && new Date(c.validFrom) > now) return false;
    if (c.validUntil && new Date(c.validUntil) < now) return false;
    return true;
  });

  return {
    courses: publishedCourses,
    featured: featuredCourses,
    enrollments: recentEnrollments,
    payments: recentPayments,
    coupons: activeCoupons,
    stats: {
      totalCourses: publishedCourses.length,
      featuredCourses: featuredCourses.length,
      totalEnrollments: recentEnrollments.length,
      totalCapturedPayments: recentPayments.filter((p) => (p.status || '').toLowerCase() === 'captured').length,
      activeCoupons: activeCoupons.length,
    },
  };
};
