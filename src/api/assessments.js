import apiClient from './client.js';

export const assessmentsApi = {
  getQuizzes: (courseId, params = {}) => 
    apiClient.get(`/courses/${courseId}/assessments/quizzes`, { params }),

  getQuiz: (courseId, quizId) => 
    apiClient.get(`/courses/${courseId}/assessments/quizzes/${quizId}`),

  createQuiz: (courseId, data) => 
    apiClient.post(`/courses/${courseId}/assessments/quizzes`, data),

  updateQuiz: (courseId, quizId, data) => 
    apiClient.put(`/courses/${courseId}/assessments/quizzes/${quizId}`, data),

  deleteQuiz: (courseId, quizId) => 
    apiClient.delete(`/courses/${courseId}/assessments/quizzes/${quizId}`),

  saveQuizQuestions: (courseId, quizId, questions) => 
    apiClient.put(`/courses/${courseId}/assessments/quizzes/${quizId}/questions`, { questions }),

  submitQuizAttempt: (courseId, quizId, answersJson) => 
    apiClient.post(`/courses/${courseId}/assessments/quizzes/${quizId}/attempts`, { answersJson }),

  getQuizAttempts: (courseId, quizId) => 
    apiClient.get(`/courses/${courseId}/assessments/quizzes/${quizId}/attempts`),

  getAssignments: (courseId, params = {}) => 
    apiClient.get(`/courses/${courseId}/assessments/assignments`, { params }),

  createAssignment: (courseId, data) => 
    apiClient.post(`/courses/${courseId}/assessments/assignments`, data),

  updateAssignment: (courseId, assignmentId, data) => 
    apiClient.put(`/courses/${courseId}/assessments/assignments/${assignmentId}`, data),

  deleteAssignment: (courseId, assignmentId) => 
    apiClient.delete(`/courses/${courseId}/assessments/assignments/${assignmentId}`),

  submitAssignment: (courseId, assignmentId, fileUrl) => 
    apiClient.post(`/courses/${courseId}/assessments/assignments/${assignmentId}/submissions`, { fileUrl }),

  getAssignmentSubmissions: (courseId, assignmentId) => 
    apiClient.get(`/courses/${courseId}/assessments/assignments/${assignmentId}/submissions`),

  getPassingRules: (courseId) =>
    apiClient.get(`/courses/${courseId}/assessments/passing-rules`)
};
