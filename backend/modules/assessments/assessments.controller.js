import * as assessmentsService from './assessments.service.js';

export const getPassingRules = async (req, res) => {
  try {
    const rules = await assessmentsService.getPassingRules(req.params.courseId);
    res.json({ success: true, data: rules || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePassingRules = async (req, res) => {
  try {
    const rules = await assessmentsService.updatePassingRules(req.params.courseId, req.body);
    res.json({ success: true, data: rules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const { moduleId, lessonId } = req.query;
    const quizzes = await assessmentsService.getQuizzes(req.params.courseId, moduleId, lessonId);
    res.json({ success: true, data: quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuiz = async (req, res) => {
  try {
    const quiz = await assessmentsService.getQuiz(req.params.quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const data = { ...req.body, courseId: req.params.courseId };
    const quiz = await assessmentsService.createQuiz(data);
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const quiz = await assessmentsService.updateQuiz(req.params.quizId, req.body);
    res.json({ success: true, data: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    await assessmentsService.deleteQuiz(req.params.quizId);
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveQuizQuestions = async (req, res) => {
  try {
    await assessmentsService.saveQuizQuestions(req.params.quizId, req.body.questions);
    res.json({ success: true, message: 'Questions saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const { moduleId, lessonId } = req.query;
    const assignments = await assessmentsService.getAssignments(req.params.courseId, moduleId, lessonId);
    res.json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const data = { ...req.body, courseId: req.params.courseId };
    await assessmentsService.createAssignment(data);
    res.status(201).json({ success: true, message: 'Assignment created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    await assessmentsService.updateAssignment(req.params.assignmentId, req.body);
    res.json({ success: true, message: 'Assignment updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    await assessmentsService.deleteAssignment(req.params.assignmentId);
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Student Endpoints

export const submitQuizAttempt = async (req, res) => {
  try {
    const attempt = await assessmentsService.submitQuizAttempt(req.params.quizId, req.user.uid, req.body.answersJson);
    res.status(201).json({ success: true, data: attempt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuizAttempts = async (req, res) => {
  try {
    const attempts = await assessmentsService.getQuizAttempts(req.params.quizId, req.user.uid);
    res.json({ success: true, data: attempts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitAssignment = async (req, res) => {
  try {
    const submission = await assessmentsService.submitAssignment(req.params.assignmentId, req.user.uid, req.body.fileUrl);
    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAssignmentSubmissions = async (req, res) => {
  try {
    const submissions = await assessmentsService.getAssignmentSubmissions(req.params.assignmentId, req.user.uid);
    res.json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
