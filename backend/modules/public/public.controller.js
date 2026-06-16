import { asyncHandler } from '../../middleware/asyncHandler.js';
import { getPublicData } from './public.service.js';

export const publicRealtime = asyncHandler(async (req, res) => {
  try {
    const data = await getPublicData();
    res.json(data);
  } catch (err) {
    if (err?.code === 'ER_NO_SUCH_TABLE') {
      return res.json({ courses: [], featured: [], enrollments: [], payments: [], coupons: [], stats: { totalCourses: 0, featuredCourses: 0, totalEnrollments: 0, totalCapturedPayments: 0, activeCoupons: 0 } });
    }
    throw err;
  }
});
