// ============================================================================
// COURSE CONTENT OPERATIONS
// ============================================================================

/**
 * Get course content by course ID
 */
export const getCourseContent = async (courseId) => {
  try {
    const contentRef = collection(db, "course_content");
    // Remove orderBy to avoid composite index; we'll sort client-side
    const q = query(contentRef, where("courseId", "==", courseId));

    const snapshot = await getDocs(q);
    const content = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return { success: true, data: content };
  } catch (error) {
    console.error("Error fetching course content:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get specific module content
 */
export const getModuleContent = async (courseId, moduleId) => {
  try {
    const contentRef = doc(db, "course_content", `${courseId}_${moduleId}`);
    const contentSnap = await getDoc(contentRef);

    if (contentSnap.exists()) {
      return {
        success: true,
        data: { id: contentSnap.id, ...contentSnap.data() },
      };
    } else {
      return { success: false, error: "Module content not found" };
    }
  } catch (error) {
    console.error("Error fetching module content:", error);
    return { success: false, error: error.message };
  }
};

export default {
  // Course content operations
  getCourseContent,
  getModuleContent,
};
