import { authApi } from '../../api/index.js';

export const normalizeUser = (user) => {
  if (!user) return null;
  const normalized = authApi?.normalizeUser ? authApi.normalizeUser(user) : { ...user };
  const uid = normalized.uid ?? normalized.id ?? normalized.userId ?? normalized.user_id;
  const isActive = normalized.isActive ?? normalized.active ?? normalized.status === 'active';
  const isAdmin = normalized.isAdmin ?? normalized.role === 'admin';
  return {
    ...normalized,
    uid: uid ?? null,
    id: normalized.id ?? uid ?? null,
    role: normalized.role ?? (isAdmin ? 'admin' : 'student'),
    isAdmin,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    status: normalized.status ?? (isActive ? 'active' : 'inactive'),
  };
};

export const normalizeCourse = (course) => {
  if (!course) return null;
  const id = String(course.courseId ?? course.id ?? course.slug ?? '');
  return {
    ...course,
    id,
    courseId: course.courseId ?? id,
    price: Number.isFinite(Number(course.price)) ? Number(course.price) : 0,
    originalPrice: Number.isFinite(Number(course.originalPrice))
      ? Number(course.originalPrice)
      : course.originalPrice ?? null,
  };
};
