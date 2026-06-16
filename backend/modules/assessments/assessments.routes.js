import express from 'express';
import { authenticateToken, requireAdmin } from '../../middleware/auth.js';
import * as assessmentsController from './assessments.controller.js';

const router = express.Router({ mergeParams: true });

// Base path in server.js will be /api/courses/:courseId/assessments

// Passing Rules
router.get('/passing-rules', authenticateToken, requireAdmin, assessmentsController.getPassingRules);
router.put('/passing-rules', authenticateToken, requireAdmin, assessmentsController.updatePassingRules);

// Quizzes
router.get('/quizzes', authenticateToken, assessmentsController.getQuizzes);
router.post('/quizzes', authenticateToken, requireAdmin, assessmentsController.createQuiz);

// Quiz specific
router.get('/quizzes/:quizId', authenticateToken, assessmentsController.getQuiz);
router.put('/quizzes/:quizId', authenticateToken, requireAdmin, assessmentsController.updateQuiz);
router.delete('/quizzes/:quizId', authenticateToken, requireAdmin, assessmentsController.deleteQuiz);

// Quiz Questions
router.put('/quizzes/:quizId/questions', authenticateToken, requireAdmin, assessmentsController.saveQuizQuestions);

// Student Quiz Attempts
router.post('/quizzes/:quizId/attempts', authenticateToken, assessmentsController.submitQuizAttempt);
router.get('/quizzes/:quizId/attempts', authenticateToken, assessmentsController.getQuizAttempts);

// Assignments
router.get('/assignments', authenticateToken, assessmentsController.getAssignments);
router.post('/assignments', authenticateToken, requireAdmin, assessmentsController.createAssignment);

// Assignment specific
router.put('/assignments/:assignmentId', authenticateToken, requireAdmin, assessmentsController.updateAssignment);
router.delete('/assignments/:assignmentId', authenticateToken, requireAdmin, assessmentsController.deleteAssignment);

// Student Assignment Submissions
router.post('/assignments/:assignmentId/submissions', authenticateToken, assessmentsController.submitAssignment);
router.get('/assignments/:assignmentId/submissions', authenticateToken, assessmentsController.getAssignmentSubmissions);

export default router;
