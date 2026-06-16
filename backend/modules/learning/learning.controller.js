import { asyncHandler } from '../../middleware/asyncHandler.js';
import * as LearningService from './learning.service.js';

export const myEnrollments = asyncHandler(async (req, res) => {
  const data = await LearningService.getMyEnrollments(req.user.id);
  res.json({ success: true, data });
});

export const byUserAndCourse = asyncHandler(async (req, res) => {
  const data = await LearningService.getByUserAndCourse(req.user.id, req.params.courseId);
  res.json({ success: true, data: data || null });
});

export const byUser = asyncHandler(async (req, res) => {
  const requestedUserId = req.params.userId === 'me' ? req.user.id : req.params.userId;
  if (requestedUserId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ success: false, error: 'Not authorized' });
  }
  const statusFilter = req.query.status ? String(req.query.status).toUpperCase() : null;
  let data = await LearningService.getMyEnrollments(requestedUserId);
  if (statusFilter) data = data.filter((e) => (e.status || '').toUpperCase() === statusFilter);
  res.json({ success: true, data });
});

export const adminList = asyncHandler(async (req, res) => {
  const data = await LearningService.getAllEnrollments(req.query);
  res.json({ success: true, data });
});

export const adminGetById = asyncHandler(async (req, res) => {
  const data = await LearningService.getEnrollmentById(req.params.id);
  res.json({ success: true, data });
});

export const create = asyncHandler(async (req, res) => {
  const data = await LearningService.createEnrollment(req.body, req.user);
  res.status(201).json({ success: true, data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await LearningService.updateEnrollment(req.params.id, req.body, req.user);
  res.json({ success: true, data });
});

export const remove = asyncHandler(async (req, res) => {
  await LearningService.deleteEnrollment(req.params.id, req.user);
  res.json({ success: true });
});

// Progress
export const getProgress = asyncHandler(async (req, res) => {
  const data = await LearningService.getProgress(req.user.id, req.params.courseId);
  res.json(data);
});

export const updateProgress = asyncHandler(async (req, res) => {
  const data = await LearningService.updateProgress(req.user.id, req.params.courseId, req.body);
  res.json(data);
});
