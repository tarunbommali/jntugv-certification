const COURSE_IMAGE_PLACEHOLDER = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const compactObject = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));

const toTrimmedString = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => toTrimmedString(item))
      .filter(Boolean)
      .join(", ")
      .trim();
  }
  if (typeof value === "object") {
    return Object.values(value)
      .map((item) => toTrimmedString(item))
      .filter(Boolean)
      .join(" ")
      .trim();
  }
  return "";
};

const sanitizeResourcesForSave = (resources) =>
  ensureArray(resources)
    .map((resource, index) => {
      if (!resource || typeof resource !== "object") {
        return null;
      }

      const sanitized = { ...resource };
      sanitized.id = toTrimmedString(sanitized.id) || `resource-${Date.now()}-${index}`;
      sanitized.type = toTrimmedString(sanitized.type) || "document";
      if (sanitized.title !== undefined) {
        sanitized.title = toTrimmedString(sanitized.title) || null;
      }
      if (sanitized.description !== undefined) {
        sanitized.description = toTrimmedString(sanitized.description) || null;
      }
      if (sanitized.url !== undefined) {
        const url = toTrimmedString(sanitized.url);
        sanitized.url = url || null;
      }
      delete sanitized.file;

      return compactObject(sanitized);
    })
    .filter(Boolean);

const sanitizeLessonsForSave = (lessons) =>
  ensureArray(lessons)
    .map((lesson, index) => {
      if (!lesson || typeof lesson !== "object") {
        return null;
      }

      const sanitized = { ...lesson };
      sanitized.id = toTrimmedString(sanitized.id) || `lesson-${Date.now()}-${index}`;
      sanitized.title = toTrimmedString(sanitized.title) || "";
      if (sanitized.summary !== undefined) {
        sanitized.summary = toTrimmedString(sanitized.summary) || null;
      }
      if (sanitized.description !== undefined) {
        sanitized.description = toTrimmedString(sanitized.description) || null;
      }
      if (sanitized.duration !== undefined) {
        sanitized.duration = toTrimmedString(sanitized.duration) || null;
      }
      sanitized.type = toTrimmedString(sanitized.type) || "video";
      if (sanitized.content !== undefined) {
        sanitized.content = toTrimmedString(sanitized.content) || null;
      }
      const order = Number.parseInt(sanitized.order, 10);
      sanitized.order = Number.isFinite(order) && order > 0 ? order : index + 1;
      sanitized.resources = sanitizeResourcesForSave(sanitized.resources);

      return compactObject(sanitized);
    })
    .filter(Boolean);

const sanitizeModulesForSave = (modules) =>
  ensureArray(modules)
    .map((module, index) => {
      if (!module || typeof module !== "object") {
        return null;
      }

      const sanitized = { ...module };
      sanitized.id = toTrimmedString(sanitized.id) || `module-${Date.now()}-${index}`;
      sanitized.title = toTrimmedString(sanitized.title) || "";
      if (sanitized.description !== undefined) {
        sanitized.description = toTrimmedString(sanitized.description) || null;
      }
      if (sanitized.summary !== undefined) {
        sanitized.summary = toTrimmedString(sanitized.summary) || null;
      }
      if (sanitized.duration !== undefined) {
        sanitized.duration = toTrimmedString(sanitized.duration) || null;
      }
      const order = Number.parseInt(sanitized.order, 10);
      sanitized.order = Number.isFinite(order) && order > 0 ? order : index + 1;
      sanitized.lessons = sanitizeLessonsForSave(sanitized.lessons);

      if (sanitized.resources !== undefined) {
        sanitized.resources = sanitizeResourcesForSave(sanitized.resources);
      }

      return compactObject(sanitized);
    })
    .filter(Boolean);

const ensureImageUrl = (value) => {
  const trimmed = toTrimmedString(value);
  return trimmed || COURSE_IMAGE_PLACEHOLDER;
};

const toNumberOr = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

/**
 * Maps course data from Firebase/MySQL to form structure
 */
export const mapCourseDataToForm = (courseData, currentUser) => {
  if (!courseData) return createEmptyCourse(currentUser);

  const resolvedImage = ensureImageUrl(
    courseData.imageUrl || courseData.thumbnail || courseData.bannerImage
  );

  const resolvedThumbnail = ensureImageUrl(
    courseData.thumbnailUrl || courseData.thumbnail || courseData.bannerImage
  );

  const resolvedPromoVideo =
    courseData.videoUrl ||
    courseData.previewVideo ||
    courseData.previewVideoUrl ||
    "";

  const resolvedPreviewVideo =
    courseData.previewVideoUrl ||
    courseData.previewVideo ||
    "";

  const rawPrice = courseData.coursePrice ?? courseData.price ?? 0;
  const price = Number.isFinite(Number(rawPrice)) ? Number(rawPrice) : 0;

  const rawOriginalPrice =
    courseData.originalPrice ?? courseData.courseOriginalPrice ?? null;
  const originalPrice =
    rawOriginalPrice === null || rawOriginalPrice === undefined
      ? ""
      : Number.isFinite(Number(rawOriginalPrice))
        ? Number(rawOriginalPrice)
        : "";

  return {
    // Map courseTitle → title, courseDescription → description, etc.
    title: courseData.courseTitle || courseData.title || "",
    description: courseData.courseDescription || courseData.description || "",
    shortDescription: courseData.shortDescription || "",
    category: courseData.category || "web-development",
    instructor: courseData.instructor || "",
    price,
    originalPrice,
    duration: courseData.duration || "",
    level: courseData.level || courseData.difficulty || "beginner",
    language: courseData.language || "english",
    isPublished: Boolean(courseData.isPublished),
    isFeatured: Boolean(courseData.isFeatured),
    isBestseller: Boolean(courseData.isBestseller),
    imageUrl: resolvedImage,
    videoUrl: resolvedPromoVideo,
    thumbnailUrl: resolvedThumbnail,
    previewVideoUrl: resolvedPreviewVideo,
    tags: ensureArray(courseData.tags),
    requirements: ensureArray(courseData.requirements),
    whatYouLearn: ensureArray(courseData.whatYouLearn),
    status: courseData.status || "draft",
    totalEnrollments: courseData.totalEnrollments || 0,
    averageRating: courseData.averageRating || 0,
    totalRatings: courseData.totalRatings || 0,
    createdAt: courseData.createdAt || new Date().toISOString(),
    updatedAt: courseData.updatedAt || new Date().toISOString(),
    createdBy: courseData.createdBy || currentUser?.uid || currentUser?.id || "",
    // Add content type field
    contentType: courseData.contentType || "modules", // Default to modules
    passingRules: courseData.passingRules || {
      completionPercentage: 80,
      practiceQuizRequired: false,
      moduleAssessmentRequired: true,
      moduleAssessmentPassScore: 70,
      assignmentRequired: false,
      assignmentPassScore: 60,
      finalAssessmentRequired: false,
      certificateScore: 75
    }
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
  originalPrice: "",
  duration: "",
  level: "beginner",
  language: "english",
  isPublished: false,
  isFeatured: false,
  isBestseller: false,
  imageUrl: COURSE_IMAGE_PLACEHOLDER,
  thumbnailUrl: COURSE_IMAGE_PLACEHOLDER,
  videoUrl: "",
  previewVideoUrl: "",
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
  passingRules: {
    completionPercentage: 80,
    practiceQuizRequired: false,
    moduleAssessmentRequired: true,
    moduleAssessmentPassScore: 70,
    assignmentRequired: false,
    assignmentPassScore: 60,
    finalAssessmentRequired: false,
    certificateScore: 75
  }
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
  const now = new Date().toISOString();
  const sanitizedModules = sanitizeModulesForSave(modules);
  const tags = ensureArray(course.tags).map((tag) =>
    typeof tag === "string" ? tag.trim() : tag
  ).filter(Boolean);
  const requirements = ensureArray(course.requirements);
  const learningPoints = ensureArray(course.whatYouLearn);

  const payload = {
    title: toTrimmedString(course.title),
    description: toTrimmedString(course.description),
    shortDescription: toTrimmedString(course.shortDescription),
    category: toTrimmedString(course.category),
    instructor: toTrimmedString(course.instructor),
    duration: toTrimmedString(course.duration),
    level: toTrimmedString(course.level || course.difficulty || "beginner"),
    difficulty: toTrimmedString(course.level || course.difficulty || "beginner"),
    language: toTrimmedString(course.language || "english"),
    price: toNumberOr(course.price, 0),
    originalPrice:
      course.originalPrice === "" || course.originalPrice === null
        ? null
        : toNumberOr(course.originalPrice, 0),
    isPublished: Boolean(course.isPublished),
    isFeatured: Boolean(course.isFeatured),
    isBestseller: Boolean(course.isBestseller),
    imageUrl: ensureImageUrl(course.imageUrl),
    thumbnailUrl: ensureImageUrl(course.thumbnailUrl),
    videoUrl: toTrimmedString(course.videoUrl),
    previewVideoUrl: toTrimmedString(course.previewVideoUrl),
    tags,
    requirements,
    whatYouLearn: learningPoints,
    status: course.isPublished ? "published" : "draft",
    updatedAt: now,
    modules: sanitizedModules,
    passingRules: course.passingRules || undefined,
    contentType: course.contentType || "modules",
    totalEnrollments: toNumberOr(course.totalEnrollments, 0),
    averageRating: toNumberOr(course.averageRating, 0),
    totalRatings: toNumberOr(course.totalRatings, 0),
  };

  const creatorId = course.createdBy ?? currentUser?.uid ?? currentUser?.id ?? null;

  if (isNewCourse) {
    payload.createdAt = now;
    payload.createdBy = creatorId;
  } else if (course.createdAt) {
    payload.createdAt = course.createdAt;
    // Avoid sending createdBy on updates to prevent foreign key conflicts
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
