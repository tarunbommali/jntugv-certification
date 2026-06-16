// eslint-disable-next-line no-unused-vars
import { Award, AlertCircle, Trash2, Calendar, FileCheck } from 'lucide-react';

const LESSON_TASK_TYPES = new Set(['assignment', 'quiz', 'task', 'project', 'assessment']);
const RESOURCE_TASK_TYPES = new Set(['task', 'assignment', 'quiz', 'project', 'link']);

const normalizeString = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const isTaskResource = (resource) => {
  const type = normalizeString(resource?.type);
  if (RESOURCE_TASK_TYPES.has(type)) {
    if (type !== 'link') {
      return true;
    }

    const title = normalizeString(resource?.title);
    return title.includes('task') || title.includes('assignment') || title.includes('project');
  }

  return false;
};

// Certification status icons and colors
export const getCertificationStatusIcon = (status) => {
  switch (status) {
    case 'ISSUED':
      return <Award className="w-4 h-4" />;
    case 'PENDING':
      return <AlertCircle className="w-4 h-4" />;
    case 'REVOKED':
      return <Trash2 className="w-4 h-4" />;
    case 'EXPIRED':
      return <Calendar className="w-4 h-4" />;
    default:
      return <FileCheck className="w-4 h-4" />;
  }
};

export const getCertificationStatusColor = (status) => {
  switch (status) {
    case 'ISSUED':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'REVOKED':
      return 'bg-red-100 text-red-800';
    case 'EXPIRED':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-surface-elevated text-foreground';
  }
};

export const getUniqueCertificationStatuses = (certifications) => {
  const statuses = certifications.map(c => c.status).filter(Boolean);
  return [...new Set(statuses)].sort();
};

// Filter certifications based on various criteria
export const filterCertifications = (certifications, filters) => {
  const { searchTerm, statusFilter, userFilter, courseFilter } = filters;
  
  return certifications.filter(certification => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const userMatch = certification.user?.username?.toLowerCase().includes(searchLower) ||
                       certification.user?.email?.toLowerCase().includes(searchLower);
      const courseMatch = certification.course?.title?.toLowerCase().includes(searchLower) ||
                         certification.course?.category?.toLowerCase().includes(searchLower);
      
      if (!userMatch && !courseMatch) return false;
    }
    
    // Status filter
    if (statusFilter !== 'ALL' && certification.status !== statusFilter) {
      return false;
    }
    
    // User filter
    if (userFilter !== 'ALL' && certification.userId !== userFilter) {
      return false;
    }
    
    // Course filter
    if (courseFilter !== 'ALL' && certification.courseId !== courseFilter) {
      return false;
    }
    
    return true;
  });
};

// Calculate certification statistics
export const calculateCertificationStats = (certifications) => {
  const total = certifications.length;
  const issued = certifications.filter(c => c.status === 'ISSUED').length;
  const pending = certifications.filter(c => c.status === 'PENDING').length;
  const revoked = certifications.filter(c => c.status === 'REVOKED').length;
  const expired = certifications.filter(c => c.status === 'EXPIRED').length;
  
  const validCertifications = certifications.filter(c => 
    c.status === 'ISSUED' && c.overallScore > 0
  );
  const averageScore = validCertifications.length > 0
    ? Number((validCertifications.reduce((sum, c) => sum + c.overallScore, 0) / validCertifications.length).toFixed(1))
    : 0;

  return {
    total,
    issued,
    pending,
    revoked,
    expired,
    averageScore,
  };
};

// Clean certification data
export const getCleanCertificationData = (certification) => ({
  ...certification,
  overallScore: certification.overallScore || 0,
  completionPercentage: certification.completionPercentage || 0,
  taskProgress: certification.taskProgress || {
    totalTasks: 0,
    completedTasks: 0,
    completionPercentage: 0,
  },
  validated: Boolean(certification.validated),
  status: certification.status || 'PENDING',
});

// Validate certification data
export const isValidCertification = (certification) => {
  return certification &&
         certification.id &&
         certification.userId &&
         certification.courseId &&
         certification.status;
};

export const computeCourseTaskSummary = (course) => {
  if (!course) {
    return {
      totalTasks: 0,
      lessonTaskCount: 0,
      resourceTaskCount: 0,
      details: [],
    };
  }

  const modules = Array.isArray(course.modules) ? course.modules : [];
  let lessonTaskCount = 0;
  let resourceTaskCount = 0;
  const details = [];

  modules.forEach((module) => {
    const moduleTitle = module?.title || 'Module';
    const lessons = Array.isArray(module?.lessons) ? module.lessons : [];

    lessons.forEach((lesson) => {
      const lessonTitle = lesson?.title || 'Lesson';
      const lessonType = normalizeString(lesson?.type);

      if (LESSON_TASK_TYPES.has(lessonType)) {
        lessonTaskCount += 1;
        details.push({
          kind: 'lesson',
          moduleId: module?.id,
          lessonId: lesson?.id,
          moduleTitle,
          lessonTitle,
          label: lessonType,
        });
      }

      const lessonResources = Array.isArray(lesson?.resources) ? lesson.resources : [];
      lessonResources.forEach((resource) => {
        if (isTaskResource(resource)) {
          resourceTaskCount += 1;
          details.push({
            kind: 'resource',
            moduleId: module?.id,
            lessonId: lesson?.id,
            resourceId: resource?.id,
            moduleTitle,
            lessonTitle,
            title: resource?.title || resource?.type || 'Task',
            label: normalizeString(resource?.type) || 'task',
          });
        }
      });
    });

    const moduleResources = Array.isArray(module?.resources) ? module.resources : [];
    moduleResources.forEach((resource) => {
      if (isTaskResource(resource)) {
        resourceTaskCount += 1;
        details.push({
          kind: 'resource',
          moduleId: module?.id,
          resourceId: resource?.id,
          moduleTitle,
          lessonId: null,
          lessonTitle: null,
          title: resource?.title || resource?.type || 'Task',
          label: normalizeString(resource?.type) || 'task',
        });
      }
    });
  });

  return {
    totalTasks: lessonTaskCount + resourceTaskCount,
    lessonTaskCount,
    resourceTaskCount,
    details,
  };
};

export const mergeTaskProgressWithSummary = (taskProgress = {}, summary = {}) => {
  const base = taskProgress && typeof taskProgress === 'object' ? { ...taskProgress } : {};
  const derivedTotal = Number(summary.totalTasks ?? 0);
  const fallbackTotal = Number(base.totalTasks ?? base.total ?? 0);
  const totalTasks = Number.isFinite(derivedTotal) && derivedTotal > 0
    ? derivedTotal
    : Math.max(0, Number.isFinite(fallbackTotal) ? fallbackTotal : 0);

  const rawCompleted = Number(base.completedTasks ?? base.completed ?? 0);
  const completedTasks = totalTasks > 0
    ? Math.min(totalTasks, Math.max(0, rawCompleted))
    : Math.max(0, rawCompleted);

  const rawCompletion = Number(base.completionPercentage ?? base.percent ?? 0);
  const computedCompletion = totalTasks > 0
    ? (completedTasks / totalTasks) * 100
    : 0;

  const completionPercentage = totalTasks > 0
    ? Number(Number.isFinite(rawCompletion) && rawCompletion > 0
      ? Math.min(100, Math.max(0, rawCompletion)).toFixed(2)
      : computedCompletion.toFixed(2))
    : Number(Number.isFinite(rawCompletion) ? Math.min(100, Math.max(0, rawCompletion)).toFixed(2) : '0');

  const validated = Boolean(base.validated ?? base.isValidated ?? base.manualValidation ?? false);
  const manualNotes = typeof base.manualNotes === 'string' ? base.manualNotes : null;
  const validatedAt = validated ? base.validatedAt ?? null : null;
  const validatedBy = validated ? base.validatedBy ?? null : null;

  return {
    totalTasks,
    completedTasks,
    completionPercentage,
    validated,
    manualNotes,
    validatedAt,
    validatedBy,
  };
};