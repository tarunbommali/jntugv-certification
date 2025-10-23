/**
 * Maps course data from Firebase to form structure
 */
export const mapCourseDataToForm = (courseData, currentUser) => {
  if (!courseData) return createEmptyCourse(currentUser);

  return {
    // Map courseTitle → title, courseDescription → description, etc.
    title: courseData.courseTitle || courseData.title || "",
    description: courseData.courseDescription || courseData.description || "",
    shortDescription: courseData.shortDescription || "",
    category: courseData.category || "web-development",
    instructor: courseData.instructor || "",
    price: courseData.coursePrice || courseData.price || 0,
    originalPrice: courseData.originalPrice || 0,
    duration: courseData.duration || "",
    level: courseData.level || "beginner",
    language: courseData.language || "english",
    isPublished: courseData.isPublished || false,
    isFeatured: courseData.isFeatured || false,
    isBestseller: courseData.isBestseller || false,
    imageUrl: courseData.imageUrl || "",
    videoUrl: courseData.videoUrl || "",
    tags: courseData.tags || [],
    requirements: courseData.requirements || [],
    whatYouLearn: courseData.whatYouLearn || [],
    status: courseData.status || "draft",
    totalEnrollments: courseData.totalEnrollments || 0,
    averageRating: courseData.averageRating || 0,
    totalRatings: courseData.totalRatings || 0,
    createdAt: courseData.createdAt || new Date().toISOString(),
    updatedAt: courseData.updatedAt || new Date().toISOString(),
    createdBy: courseData.createdBy || currentUser?.uid || "",
    // Add content type field
    contentType: courseData.contentType || "modules", // Default to modules
  };
};

/**
 * Creates initial empty course state
 */
export const createEmptyCourse = (currentUser) => ({
  title: "",
  courseTitle: "",
  description: "",
  courseDescription: "",
  shortDescription: "",
  category: "web-development",
  instructor: "",
  price: 0,
  coursePrice: 0,
  originalPrice: 0,
  duration: "",
  level: "beginner",
  language: "english",
  isPublished: false,
  isFeatured: false,
  isBestseller: false,
  imageUrl: "",
  videoUrl: "",
  tags: [],
  requirements: [],
  whatYouLearn: [],
  status: "draft",
  totalEnrollments: 0,
  averageRating: 0,
  totalRatings: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: currentUser?.uid || "",
  contentType: "modules", // Default content type
});

/**
 * Prepares course data for submission to Firebase
 */
export const prepareCoursePayload = (
  course,
  modules,
  currentUser,
  isNewCourse
) => {
  const payload = {
    title: course.title.trim(),
    description: course.description.trim(),
    shortDescription: course.shortDescription.trim(),
    category: course.category,
    instructor: course.instructor.trim(),
    price: Number(course.price),
    originalPrice: Number(course.originalPrice),
    duration: course.duration.trim(),
    level: course.level,
    language: course.language,
    isPublished: course.isPublished,
    isFeatured: course.isFeatured,
    isBestseller: course.isBestseller,
    imageUrl: course.imageUrl.trim(),
    videoUrl: course.videoUrl.trim(),
    tags: course.tags,
    requirements: course.requirements,
    whatYouLearn: course.whatYouLearn,
    status: course.isPublished ? "published" : "draft",
    updatedAt: new Date().toISOString(),
    modules: modules,
    // Include content type in payload
    contentType: course.contentType || "modules",
  };

  if (isNewCourse) {
    payload.createdBy = currentUser?.uid || "";
    payload.createdAt = new Date().toISOString();
    payload.totalEnrollments = 0;
    payload.averageRating = 0;
    payload.totalRatings = 0;
  }

  return payload;
};

/**
 * Calculates total duration from modules
 */
export const calculateTotalDuration = (modules) => {
  return modules.reduce((total, module) => {
    const match = module.duration?.match(/(\d+)\s*hour/i);
    const moduleHours = match ? parseInt(match[1]) : 0;
    return total + moduleHours;
  }, 0);
};

/**
 * Calculates total lessons count from modules
 */
export const calculateTotalLessons = (modules) => {
  return modules.reduce(
    (total, module) => total + (module.lessons?.length || 0),
    0
  );
};

/**
 * Determines if the current route is for creating a new course
 */
export const isNewCourseRoute = (courseId) => {
  return courseId === "new" || courseId === "create/new" || !courseId;
};

/**
 * Extracts actual course ID for editing (removes 'edit/' prefix if present)
 */
export const extractActualCourseId = (courseId) => {
  return courseId?.replace("edit/", "") || null;
};
