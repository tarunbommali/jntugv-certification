import { db } from '../../db/index.js';
import { 
  coursePassingRules, 
  quizzes, 
  quizQuestions, 
  assignments, 
  assignmentSubmissions, 
  quizAttempts 
} from '../../db/schema.js';
import * as LearningRepo from '../learning/learning.repository.js';
import { eq, and } from 'drizzle-orm';

export const getPassingRules = async (courseId) => {
  const rules = await db.select().from(coursePassingRules).where(eq(coursePassingRules.courseId, courseId));
  return rules[0] || null;
};

export const updatePassingRules = async (courseId, data) => {
  const existing = await getPassingRules(courseId);
  if (existing) {
    await db.update(coursePassingRules).set(data).where(eq(coursePassingRules.courseId, courseId));
  } else {
    await db.insert(coursePassingRules).values({ courseId, ...data });
  }
  return getPassingRules(courseId);
};

export const getQuizzes = async (courseId, moduleId = null, lessonId = null) => {
  let conditions = [eq(quizzes.courseId, courseId)];
  if (moduleId) conditions.push(eq(quizzes.moduleId, moduleId));
  if (lessonId) conditions.push(eq(quizzes.lessonId, lessonId));
  
  return await db.select().from(quizzes).where(and(...conditions));
};

export const getQuiz = async (quizId) => {
  const q = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
  if (!q[0]) return null;
  const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId));
  return { ...q[0], questions };
};

export const createQuiz = async (data) => {
  await db.insert(quizzes).values(data);
  const q = await db.select().from(quizzes).where(eq(quizzes.id, data.id || '')).orderBy(quizzes.createdAt);
  // Drizzle mysql doesn't return the inserted row easily without last insert id, but UUID is used.
  // We can just rely on the UUID passed in data or fetched
  return q[q.length - 1]; // basic fallback if id wasn't generated externally
};

export const updateQuiz = async (quizId, data) => {
  await db.update(quizzes).set(data).where(eq(quizzes.id, quizId));
  return getQuiz(quizId);
};

export const deleteQuiz = async (quizId) => {
  await db.delete(quizzes).where(eq(quizzes.id, quizId));
  return true;
};

export const saveQuizQuestions = async (quizId, questionsData) => {
  // Clear existing
  await db.delete(quizQuestions).where(eq(quizQuestions.quizId, quizId));
  
  if (questionsData && questionsData.length > 0) {
    const formatted = questionsData.map((q, i) => ({
      quizId,
      questionJson: q.questionJson,
      sortOrder: q.sortOrder || i + 1
    }));
    await db.insert(quizQuestions).values(formatted);
  }
  return true;
};

export const getAssignments = async (courseId, moduleId = null, lessonId = null) => {
  let conditions = [eq(assignments.courseId, courseId)];
  if (moduleId) conditions.push(eq(assignments.moduleId, moduleId));
  if (lessonId) conditions.push(eq(assignments.lessonId, lessonId));
  
  return await db.select().from(assignments).where(and(...conditions));
};

export const getAssignment = async (assignmentId) => {
  const a = await db.select().from(assignments).where(eq(assignments.id, assignmentId));
  return a[0] || null;
};

export const createAssignment = async (data) => {
  await db.insert(assignments).values(data);
  return true;
};

export const updateAssignment = async (assignmentId, data) => {
  await db.update(assignments).set(data).where(eq(assignments.id, assignmentId));
  return true;
};

export const deleteAssignment = async (assignmentId) => {
  await db.delete(assignments).where(eq(assignments.id, assignmentId));
  return true;
};

export const submitQuizAttempt = async (quizId, studentId, answersJson) => {
  const quiz = await getQuiz(quizId);
  if (!quiz) throw new Error("Quiz not found");
  
  // SEC-04 Fix: Validate student enrollment before grading
  const enrollment = await LearningRepo.findByUserAndCourse(studentId, quiz.courseId);
  if (!enrollment || enrollment.status !== 'ACTIVE') {
    throw Object.assign(new Error("You must be actively enrolled in this course to submit a quiz."), { statusCode: 403 });
  }
  
  let score = 0;
  let totalMarks = 0;

  quiz.questions.forEach((q, i) => {
    const qData = q.questionJson || {};
    const marks = qData.marks || 1;
    totalMarks += marks;
    
    const studentAnswer = answersJson[i]; 
    
    if (qData.type === 'mcq' || qData.type === 'true_false') {
      const correctIdxs = qData.correct_indexes || [0];
      const studAns = Array.isArray(studentAnswer) ? studentAnswer : [studentAnswer];
      
      if (studAns.length === correctIdxs.length && studAns.every(val => correctIdxs.includes(val))) {
        score += marks;
      }
    } else if (qData.type === 'fill_blank') {
      const correctStr = (qData.options && qData.options[0]) || "";
      if (String(studentAnswer || "").toLowerCase().trim() === String(correctStr).toLowerCase().trim()) {
        score += marks;
      }
    }
  });

  const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
  const passed = percentage >= (quiz.passingPercentage || 70);

  const attemptData = {
    quizId,
    studentId,
    answersJson,
    score,
    percentage,
    passed,
    completedAt: new Date()
  };

  await db.insert(quizAttempts).values(attemptData);
  return attemptData;
};

export const getQuizAttempts = async (quizId, studentId) => {
  return await db.select().from(quizAttempts).where(
    and(eq(quizAttempts.quizId, quizId), eq(quizAttempts.studentId, studentId))
  ).orderBy(quizAttempts.createdAt);
};

export const submitAssignment = async (assignmentId, studentId, fileUrl) => {
  const submissionData = {
    assignmentId,
    studentId,
    fileUrl,
    status: 'pending'
  };
  await db.insert(assignmentSubmissions).values(submissionData);
  return submissionData;
};

export const getAssignmentSubmissions = async (assignmentId, studentId) => {
  return await db.select().from(assignmentSubmissions).where(
    and(eq(assignmentSubmissions.assignmentId, assignmentId), eq(assignmentSubmissions.studentId, studentId))
  );
};
