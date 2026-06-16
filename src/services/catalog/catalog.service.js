import { coursesApi } from '../../api/index.js';
import { extractData, success, failure } from '../shared/response.js';
import { normalizeCourse } from '../shared/normalizers.js';

export const getAllCourses = async (params = {}) => {
  try {
    let courses;
    try {
      courses = await coursesApi.getAdminCourses();
    } catch {
      courses = await coursesApi.getCourses(params);
    }
    const coursesData = extractData(courses);
    return success(Array.isArray(coursesData) ? coursesData.map((course) => normalizeCourse(course)) : []);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const getCourseById = async (courseId) => {
  try {
    const response = await coursesApi.getCourseById(courseId);
    const course = extractData(response);
    return success(normalizeCourse(course));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const createCourse = async (payload) => {
  try {
    const result = await coursesApi.createCourse(payload);
    if (!result?.success) {
      return failure(result?.error || 'Failed to create course', { details: result?.payload, status: result?.status });
    }
    return success(extractData(result));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const updateCourse = async (courseId, payload) => {
  try {
    const result = await coursesApi.updateCourse(courseId, payload);
    if (!result?.success) {
      return failure(result?.error || 'Failed to update course', { details: result?.payload, status: result?.status });
    }
    return success(extractData(result));
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};

export const deleteCourse = async (courseId) => {
  try {
    await coursesApi.deleteCourse(courseId);
    return success(true);
  } catch (error) {
    return failure(error, { details: error?.payload });
  }
};
