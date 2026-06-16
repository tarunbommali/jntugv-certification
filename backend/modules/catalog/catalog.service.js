import { randomUUID } from 'crypto';
import * as CatalogRepo from './catalog.repository.js';
import * as AssessmentsService from '../assessments/assessments.service.js';

// All normalization helpers preserved from the original routes/courses.js
const ensureArray = (value) => (Array.isArray(value) ? value : []);
const compactObject = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

const toTrimmedString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value).trim();
  if (Array.isArray(value)) return value.map(toTrimmedString).filter(Boolean).join(', ').trim();
  if (typeof value === 'object') return Object.values(value).map(toTrimmedString).filter(Boolean).join(' ').trim();
  return '';
};

const coerceInt = (value, fallback = 0) => {
  if (value === null || value === undefined || value === '') return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
};

const coerceNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const sanitizeDuration = (value) => {
  if (!value && value !== 0) return null;
  if (typeof value === 'string') return value.trim() || null;
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : null;
  return null;
};

const sanitizeResources = (resources) =>
  ensureArray(resources).map((r) => {
    if (!r || typeof r !== 'object') return null;
    const s = { ...r };
    s.id = toTrimmedString(s.id) || randomUUID();
    s.type = toTrimmedString(s.type) || 'document';
    if (s.title !== undefined) s.title = toTrimmedString(s.title) || null;
    if (s.url !== undefined) s.url = toTrimmedString(s.url) || null;
    delete s.file;
    return compactObject(s);
  }).filter(Boolean);

const sanitizeLessons = (lessons) =>
  ensureArray(lessons).map((lesson, i) => {
    if (!lesson || typeof lesson !== 'object') return null;
    const s = { ...lesson };
    s.id = toTrimmedString(s.id) || randomUUID();
    s.title = toTrimmedString(s.title) || '';
    s.type = toTrimmedString(s.type) || 'video';
    if (s.duration !== undefined) s.duration = sanitizeDuration(s.duration);
    if (s.content !== undefined) s.content = toTrimmedString(s.content) || null;
    const order = coerceInt(s.order, i + 1);
    s.order = order > 0 ? order : i + 1;
    s.resources = sanitizeResources(s.resources);
    return compactObject(s);
  }).filter(Boolean);

const sanitizeModules = (modules) =>
  ensureArray(modules).map((mod, i) => {
    if (!mod || typeof mod !== 'object') return null;
    const s = { ...mod };
    s.id = toTrimmedString(s.id) || randomUUID();
    s.title = toTrimmedString(s.title) || '';
    if (s.description !== undefined) s.description = toTrimmedString(s.description) || null;
    if (s.duration !== undefined) s.duration = sanitizeDuration(s.duration);
    const order = coerceInt(s.order, i + 1);
    s.order = order > 0 ? order : i + 1;
    s.lessons = sanitizeLessons(s.lessons);
    if (s.resources !== undefined) s.resources = sanitizeResources(s.resources);
    return compactObject(s);
  }).filter(Boolean);

export const normalizeCourseInput = (input = {}, { isNew = false, userId } = {}) => {
  const now = new Date();
  const normalized = { updatedAt: now };

  const str = (v) => toTrimmedString(v) || null;

  if (input.title !== undefined || isNew) normalized.title = toTrimmedString(input.title) || '';
  if (input.description !== undefined || isNew) normalized.description = str(input.description);
  if (input.shortDescription !== undefined || isNew) normalized.shortDescription = str(input.shortDescription);
  if (input.category !== undefined || isNew) normalized.category = str(input.category);
  if (input.instructor !== undefined || isNew) normalized.instructor = str(input.instructor);
  if (input.instructorBio !== undefined) normalized.instructorBio = str(input.instructorBio);
  if (input.duration !== undefined || isNew) normalized.duration = sanitizeDuration(input.duration);
  if (input.difficulty !== undefined || input.level !== undefined || isNew) normalized.difficulty = toTrimmedString(input.difficulty ?? input.level) || 'beginner';
  if (input.language !== undefined || isNew) normalized.language = toTrimmedString(input.language) || 'English';
  if (input.price !== undefined || isNew) normalized.price = coerceInt(input.price, 0);
  if (input.currency !== undefined || isNew) normalized.currency = toTrimmedString(input.currency) || 'INR';
  if (input.originalPrice !== undefined) normalized.originalPrice = (input.originalPrice === '' || input.originalPrice === null) ? null : coerceInt(input.originalPrice, 0);
  if (input.isPublished !== undefined || isNew) normalized.isPublished = Boolean(input.isPublished);
  if (input.isFeatured !== undefined || isNew) normalized.isFeatured = Boolean(input.isFeatured);
  if (input.isBestseller !== undefined || isNew) normalized.isBestseller = Boolean(input.isBestseller);

  const thumb = input.thumbnail ?? input.imageUrl ?? input.thumbnailUrl;
  if (thumb !== undefined) normalized.thumbnail = toTrimmedString(thumb) || null;
  const banner = input.bannerImage ?? input.heroImage ?? null;
  if (banner !== null || input.bannerImage !== undefined) normalized.bannerImage = toTrimmedString(banner) || null;
  const preview = input.previewVideo ?? input.videoUrl ?? input.previewVideoUrl;
  if (preview !== undefined) normalized.previewVideo = toTrimmedString(preview) || null;

  if (input.tags !== undefined) normalized.tags = ensureArray(input.tags);
  if (input.requirements !== undefined) normalized.requirements = ensureArray(input.requirements);
  if (input.whatYouLearn !== undefined) normalized.whatYouLearn = ensureArray(input.whatYouLearn);
  if (input.modules !== undefined) normalized.modules = sanitizeModules(input.modules);
  if (input.contentAccessURL !== undefined) normalized.contentAccessURL = str(input.contentAccessURL);
  const contentDesc = input.contentDescription ?? input.courseDescription;
  if (contentDesc !== undefined) normalized.contentDescription = str(contentDesc);

  if (input.status !== undefined) normalized.status = toTrimmedString(input.status) || null;
  if (!normalized.status && normalized.isPublished !== undefined) normalized.status = normalized.isPublished ? 'published' : 'draft';
  if (isNew && !normalized.status) normalized.status = 'draft';

  if (input.contentType !== undefined || isNew) normalized.contentType = toTrimmedString(input.contentType) || 'modules';
  if (input.totalEnrollments !== undefined) normalized.totalEnrollments = coerceInt(input.totalEnrollments, 0);
  if (input.averageRating !== undefined) normalized.averageRating = coerceNumber(input.averageRating, 0);
  if (input.totalRatings !== undefined) normalized.totalRatings = coerceInt(input.totalRatings, 0);
  if (input.metaDescription !== undefined) normalized.metaDescription = str(input.metaDescription);
  if (input.slug !== undefined) normalized.slug = str(input.slug);

  if (isNew) {
    normalized.createdAt = input.createdAt ? new Date(input.createdAt) : now;
    normalized.createdBy = input.createdBy || userId || null;
  }

  return Object.fromEntries(Object.entries(normalized).filter(([, v]) => v !== undefined));
};

export const listCourses = async (filters) => CatalogRepo.findAll(filters);

export const getCourseById = async (id) => {
  const course = await CatalogRepo.findById(id);
  if (!course) throw Object.assign(new Error('Course not found'), { statusCode: 404 });
  return course;
};

export const createCourse = async (input, userId) => {
  const normalized = normalizeCourseInput(input, { isNew: true, userId });
  
  if (!normalized.title) throw Object.assign(new Error('Course title is required'), { statusCode: 400 });
  if (!normalized.description) throw Object.assign(new Error('Course description is required'), { statusCode: 400 });
  if (!normalized.instructor) throw Object.assign(new Error('Course instructor is required'), { statusCode: 400 });
  if (!normalized.category) throw Object.assign(new Error('Course category is required'), { statusCode: 400 });
  if (!normalized.thumbnail) throw Object.assign(new Error('Course thumbnail is required'), { statusCode: 400 });
  if (!normalized.status) throw Object.assign(new Error('Course status is required'), { statusCode: 400 });

  const courseId = input.id || randomUUID();
  const createdCourse = await CatalogRepo.create({ id: courseId, ...normalized });

  if (input.passingRules) {
    await AssessmentsService.updatePassingRules(courseId, input.passingRules);
  }

  return createdCourse;
};

export const updateCourse = async (id, input, userId) => {
  const existing = await CatalogRepo.findById(id);
  if (!existing) throw Object.assign(new Error('Course not found'), { statusCode: 404 });

  const normalized = normalizeCourseInput(input, { userId });
  if (!normalized.title) normalized.title = existing.title;
  if (!normalized.status) normalized.status = existing.status;

  const updatedCourse = await CatalogRepo.update(id, normalized);

  if (input.passingRules) {
    await AssessmentsService.updatePassingRules(id, input.passingRules);
  }

  return updatedCourse;
};

export const deleteCourse = async (id) => {
  const existing = await CatalogRepo.findById(id);
  if (!existing) throw Object.assign(new Error('Course not found'), { statusCode: 404 });
  await CatalogRepo.remove(id);
};

export const addReview = async (courseId, userId, rating, reviewText) => {
  const course = await CatalogRepo.findById(courseId);
  if (!course) throw Object.assign(new Error('Course not found'), { statusCode: 404 });

  const isEnrolled = await CatalogRepo.checkEnrollment(courseId, userId);
  if (!isEnrolled) throw Object.assign(new Error('Only enrolled students can review this course'), { statusCode: 403 });

  if (rating < 1 || rating > 5) throw Object.assign(new Error('Rating must be between 1 and 5'), { statusCode: 400 });

  const reviewId = randomUUID();
  await CatalogRepo.createReview({
    id: reviewId,
    courseId,
    userId,
    rating,
    review: reviewText,
  });

  const newStats = await CatalogRepo.updateCourseStats(courseId);
  return newStats;
};

export const getReviews = async (courseId) => {
  const course = await CatalogRepo.findById(courseId);
  if (!course) throw Object.assign(new Error('Course not found'), { statusCode: 404 });
  return CatalogRepo.getReviews(courseId);
};
