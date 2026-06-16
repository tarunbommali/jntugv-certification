import { asyncHandler } from '../../middleware/asyncHandler.js';
import * as CatalogService from './catalog.service.js';

export const list = asyncHandler(async (req, res) => {
  const courses = await CatalogService.listCourses(req.query);
  res.json({ success: true, data: courses });
});

export const adminList = asyncHandler(async (req, res) => {
  const courses = await CatalogService.listCourses({ ...req.query, includeDrafts: true });
  res.json({ success: true, data: courses });
});

export const getById = asyncHandler(async (req, res) => {
  const course = await CatalogService.getCourseById(req.params.id);
  res.json({ success: true, data: course });
});

export const create = asyncHandler(async (req, res) => {
  const course = await CatalogService.createCourse(req.body, req.user?.id);
  res.status(201).json({ success: true, message: 'Course created successfully', data: course });
});

export const update = asyncHandler(async (req, res) => {
  const course = await CatalogService.updateCourse(req.params.id, req.body, req.user?.id);
  res.json({ success: true, message: 'Course updated successfully', data: course });
});

export const remove = asyncHandler(async (req, res) => {
  await CatalogService.deleteCourse(req.params.id);
  res.json({ success: true, message: 'Course deleted successfully' });
});

export const addReview = asyncHandler(async (req, res) => {
  const { rating, review } = req.body;
  const newStats = await CatalogService.addReview(req.params.id, req.user?.id, rating, review);
  res.status(201).json({ success: true, message: 'Review added successfully', data: newStats });
});

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await CatalogService.getReviews(req.params.id);
  res.json({ success: true, data: reviews });
});
