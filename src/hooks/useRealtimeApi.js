import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
	getAllCourses,
	getCourseById,
	getUserEnrollments,
	checkUserEnrollment,
	getAllUsersData,
	getAllEnrollments,
	getAllPayments,
	getUserProgress,
	getAllActiveCoupons,
	createCourse as createCourseService,
	updateCourse as updateCourseService,
	createEnrollment as createEnrollmentService,
	updateEnrollmentProgress as updateEnrollmentProgressService,
	getAllCertifications,
	getAdminDashboardData,
} from '../services/index.js';

const useAsyncData = (fetcher, { enabled = true, initialValue } = {}) => {
	const initialRef = useRef(initialValue);
	const [data, setData] = useState(initialRef.current);
	const [loading, setLoading] = useState(Boolean(enabled));
	const [error, setError] = useState(null);

	const refresh = useCallback(async () => {
		if (!enabled) {
			setLoading(false);
			setError(null);
			setData(initialRef.current);
			return initialRef.current;
		}

		setLoading(true);
		setError(null);

		try {
			const result = await fetcher();
			setData(result);
			setLoading(false);
			return result;
		} catch (err) {
			const message = err?.message || String(err);
			setError(message);
			setData(initialRef.current);
			setLoading(false);
			throw err;
		}
	}, [enabled, fetcher]);

	useEffect(() => {
		refresh().catch(() => {});
	}, [refresh]);

	return { data, loading, error, refresh, setData };
};

export const useRealtimeCourses = (options = {}) => {
	const {
		limitCount = 50,
		publishedOnly = true,
		featuredOnly = false,
		category = null,
		enabled = true,
	} = options;

	const fetcher = useCallback(async () => {
		const response = await getAllCourses();
		if (!response?.success) {
			throw new Error(response?.error || 'Failed to fetch courses');
		}

		let courses = Array.isArray(response.data) ? [...response.data] : [];
		if (publishedOnly) {
			courses = courses.filter((course) => course?.isPublished !== false);
		}
		if (featuredOnly) {
			courses = courses.filter((course) => course?.isFeatured);
		}
		if (category) {
			const normalized = String(category).toLowerCase();
			courses = courses.filter((course) => String(course?.category || '').toLowerCase() === normalized);
		}
		if (limitCount) {
			courses = courses.slice(0, limitCount);
		}
		return courses;
	}, [publishedOnly, featuredOnly, category, limitCount]);

	const { data, loading, error, refresh } = useAsyncData(fetcher, {
		enabled,
		initialValue: [],
	});

	return { data: data ?? [], loading, error, refresh };
};

export const useRealtimeCourse = (courseId, options = {}) => {
	const { enabled = true } = options;

	const fetcher = useCallback(async () => {
		if (!courseId) {
			return null;
		}

		const response = await getCourseById(courseId);
		if (!response?.success) {
			throw new Error(response?.error || 'Failed to fetch course');
		}
		return response.data ?? null;
	}, [courseId]);

	const { data, loading, error, refresh } = useAsyncData(fetcher, {
		enabled: enabled && Boolean(courseId),
		initialValue: null,
	});

	return { course: data, loading, error, refresh };
};

export const useRealtimeUserEnrollments = (userId, options = {}) => {
	const { enabled = true } = options;

	const fetcher = useCallback(async () => {
		if (!userId) {
			return [];
		}

		const response = await getUserEnrollments(userId);
		if (!response?.success) {
			throw new Error(response?.error || 'Failed to fetch enrollments');
		}
		return Array.isArray(response.data) ? response.data : [];
	}, [userId]);

	const { data, loading, error, refresh } = useAsyncData(fetcher, {
		enabled: enabled && Boolean(userId),
		initialValue: [],
	});

	const isEnrolled = useCallback((courseId) => {
		if (!courseId) return false;
		return (data ?? []).some((enrollment) => String(enrollment.courseId) === String(courseId));
	}, [data]);

	return {
		enrollments: data ?? [],
		loading,
		error,
		refresh,
		isEnrolled,
		enrollmentCount: (data ?? []).length,
	};
};

export const useRealtimeEnrollmentStatus = (userId, courseId, options = {}) => {
	const { enabled = true } = options;

	const fetcher = useCallback(async () => {
		if (!userId || !courseId) {
			return null;
		}

		const response = await checkUserEnrollment(userId, courseId);
		if (!response?.success) {
			throw new Error(response?.error || 'Failed to fetch enrollment status');
		}
		if (response.data?.isEnrolled) {
			return response.data.enrollment ?? { courseId };
		}
		return null;
	}, [userId, courseId]);

	const { data, loading, error, refresh } = useAsyncData(fetcher, {
		enabled: enabled && Boolean(userId) && Boolean(courseId),
		initialValue: null,
	});

	return {
		enrollment: data,
		isEnrolled: Boolean(data),
		loading,
		error,
		refresh,
	};
};

export const useRealtimeAdminUsers = (options = {}) => {
	const { limitCount = 100, enabled = true } = options;

	const fetcher = useCallback(async () => {
		const response = await getAllUsersData(limitCount);
		if (!response?.success) {
			throw new Error(response?.error || 'Failed to fetch users');
		}
		return Array.isArray(response.data) ? response.data : [];
	}, [limitCount]);

	const { data, loading, error, refresh } = useAsyncData(fetcher, {
		enabled,
		initialValue: [],
	});

	return { data: data ?? [], loading, error, refresh };
};

export const useRealtimeAdminEnrollments = (options = {}) => {
	const { limitCount = 100, enabled = true } = options;

	const fetcher = useCallback(async () => {
		const response = await getAllEnrollments({ limit: limitCount });
		if (!response?.success) {
			throw new Error(response?.error || 'Failed to fetch enrollments');
		}
		return Array.isArray(response.data) ? response.data : [];
	}, [limitCount]);

	const { data, loading, error, refresh } = useAsyncData(fetcher, {
		enabled,
		initialValue: [],
	});

	return { data: data ?? [], loading, error, refresh };
};

export const useRealtimeAdminCertifications = (options = {}) => {
	const { limitCount = 100, enabled = true, filters = {} } = options;

	const filtersKey = JSON.stringify(filters || {});

	const fetcher = useCallback(async () => {
		const params = JSON.parse(filtersKey || '{}');
		if (limitCount) {
			params.limit = limitCount;
		}

		const response = await getAllCertifications(params);
		if (!response?.success) {
			throw new Error(response?.error || 'Failed to fetch certifications');
		}

		return Array.isArray(response.data) ? response.data : [];
	}, [filtersKey, limitCount]);

	const { data, loading, error, refresh } = useAsyncData(fetcher, {
		enabled,
		initialValue: [],
	});

	return { data: data ?? [], loading, error, refresh };
};

export const useRealtimeAdminPayments = (options = {}) => {
	const { limitCount = 100, enabled = true } = options;

	const fetcher = useCallback(async () => {
		const response = await getAllPayments({ limit: limitCount });
		if (!response?.success) {
			throw new Error(response?.error || 'Failed to fetch payments');
		}
		return Array.isArray(response.data) ? response.data : [];
	}, [limitCount]);

	const { data, loading, error, refresh } = useAsyncData(fetcher, {
		enabled,
		initialValue: [],
	});

	return { data: data ?? [], loading, error, refresh };
};

export const useAdminDashboard = (options = {}) => {
	const { enabled = true } = options;

	const fetcher = useCallback(async () => {
		const response = await getAdminDashboardData();
		if (!response?.success) {
			throw new Error(response?.error || 'Failed to fetch admin dashboard data');
		}
		return response.data || { courses: [], enrollments: [], users: [], payments: [], coupons: [], stats: {} };
	}, []);

	const { data, loading, error, refresh } = useAsyncData(fetcher, {
		enabled,
		initialValue: { courses: [], enrollments: [], users: [], payments: [], coupons: [], stats: {} },
	});

	return { data, loading, error, refresh };
};

export const useRealtimeUserProgress = (userId, courseId, options = {}) => {
	const { enabled = true } = options;

	const fetcher = useCallback(async () => {
		if (!userId || !courseId) {
			return null;
		}

		const response = await getUserProgress(userId, courseId);
		if (!response?.success) {
			throw new Error(response?.error || 'Failed to fetch progress');
		}
		return response.data ?? null;
	}, [userId, courseId]);

	const { data, loading, error, refresh } = useAsyncData(fetcher, {
		enabled: enabled && Boolean(userId) && Boolean(courseId),
		initialValue: null,
	});

	return { progress: data, loading, error, refresh };
};

export const useRealtimeCoupons = (options = {}) => {
	const { activeOnly = true, enabled = true } = options;

	const fetcher = useCallback(async () => {
		const response = await getAllActiveCoupons();
		if (!response?.success) {
			throw new Error(response?.error || 'Failed to fetch coupons');
		}

		let coupons = Array.isArray(response.data) ? response.data : [];
		if (activeOnly) {
			coupons = coupons.filter((coupon) => coupon?.isActive !== false);
		}
		return coupons;
	}, [activeOnly]);

	const { data, loading, error, refresh } = useAsyncData(fetcher, {
		enabled,
		initialValue: [],
	});

	return { data: data ?? [], loading, error, refresh };
};

export const useRealtimeCourseMutations = () => {
	const { currentUser } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const safeUserId = currentUser?.uid || currentUser?.id || null;

	const updateCourse = useCallback(async (courseId, payload) => {
		if (!safeUserId) {
			const message = 'User not authenticated';
			setError(message);
			return { success: false, error: message };
		}

		setLoading(true);
		setError(null);

		try {
			const response = await updateCourseService(courseId, {
				...payload,
				updatedBy: safeUserId,
			});

			if (!response?.success) {
				throw new Error(response?.error || 'Failed to update course');
			}

			return { success: true, data: response.data };
		} catch (err) {
			const message = err?.message || 'Failed to update course';
			setError(message);
			return { success: false, error: message };
		} finally {
			setLoading(false);
		}
	}, [safeUserId]);

	const createCourse = useCallback(async (payload) => {
		if (!safeUserId) {
			const message = 'User not authenticated';
			setError(message);
			return { success: false, error: message };
		}

		setLoading(true);
		setError(null);

		try {
			const response = await createCourseService({
				...payload,
				createdBy: safeUserId,
			});

			if (!response?.success) {
				throw new Error(response?.error || 'Failed to create course');
			}

			return { success: true, data: response.data };
		} catch (err) {
			const message = err?.message || 'Failed to create course';
			setError(message);
			return { success: false, error: message };
		} finally {
			setLoading(false);
		}
	}, [safeUserId]);

	return { updateCourse, createCourse, loading, error };
};

export const useRealtimeEnrollmentMutations = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const createEnrollment = useCallback(async (payload) => {
		setLoading(true);
		setError(null);

		try {
			const response = await createEnrollmentService(payload);
			if (!response?.success) {
				throw new Error(response?.error || 'Failed to create enrollment');
			}
			return { success: true, data: response.data };
		} catch (err) {
			const message = err?.message || 'Failed to create enrollment';
			setError(message);
			return { success: false, error: message };
		} finally {
			setLoading(false);
		}
	}, []);

	const updateEnrollmentProgress = useCallback(async (enrollmentId, progressPayload) => {
		setLoading(true);
		setError(null);

		try {
			const response = await updateEnrollmentProgressService(enrollmentId, progressPayload);
			if (!response?.success) {
				throw new Error(response?.error || 'Failed to update enrollment progress');
			}
			return { success: true, data: response.data };
		} catch (err) {
			const message = err?.message || 'Failed to update enrollment progress';
			setError(message);
			return { success: false, error: message };
		} finally {
			setLoading(false);
		}
	}, []);

	return { createEnrollment, updateEnrollmentProgress, loading, error };
};

export default {
	useRealtimeCourses,
	useRealtimeCourse,
	useRealtimeUserEnrollments,
	useRealtimeEnrollmentStatus,
	useRealtimeAdminUsers,
	useRealtimeAdminEnrollments,
	useRealtimeAdminCertifications,
	useRealtimeAdminPayments,
	useRealtimeUserProgress,
	useRealtimeCoupons,
	useAdminDashboard,
	useRealtimeCourseMutations,
	useRealtimeEnrollmentMutations,
};
