/* eslint-disable no-console */
import { useState, useCallback } from "react";

/**
 * Creates a new module with default values
 */
const createNewModule = (modules) => ({
  id: `module-${Date.now()}`,
  title: "New Module",
  description: "",
  order: modules?.length + 1,
  duration: "1 hour",
  lessons: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/**
 * Creates a new lesson with default values
 */
const createNewLesson = (module) => {
  const lessonCount = module.lessons?.length || 0;
  return {
    id: `lesson-${Date.now()}`,
    title: "New Lesson",
    duration: "15 min",
    type: "video",
    content: "",
    order: lessonCount + 1,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resources: [],
  };
};

/**
 * Custom hook for modules state management
 */
export const useModulesManager = (initialModules = []) => {
  const [modules, setModules] = useState(initialModules);

  const addModule = useCallback(() => {
    console.log("Adding new module...");
    const newModule = createNewModule(modules);
    setModules((prev) => {
      const updatedModules = [...prev, newModule];
      console.log("Modules after adding:", updatedModules);
      return updatedModules;
    });
    return newModule;
  }, [modules]);

  const updateModule = useCallback((moduleId, updates) => {
    console.log("Updating module:", moduleId, updates);
    setModules((prev) =>
      prev.map((module) =>
        module.id === moduleId
          ? { ...module, ...updates, updatedAt: new Date().toISOString() }
          : module
      )
    );
  }, []);

  const deleteModule = useCallback((moduleId) => {
    console.log("Deleting module:", moduleId);
    setModules((prev) => prev.filter((module) => module.id !== moduleId));
  }, []);

  const addLesson = useCallback((moduleId) => {
    console.log("Adding lesson to module:", moduleId);
    
    setModules((prev) => {
      const updatedModules = prev.map((module) => {
        if (module.id === moduleId) {
          const newLesson = createNewLesson(module);
          console.log("New lesson created:", newLesson);
          
          const currentLessons = module.lessons || [];
          const updatedLessons = [...currentLessons, newLesson];
          
          console.log("Updated lessons for module:", updatedLessons);
          
          return {
            ...module,
            lessons: updatedLessons,
            updatedAt: new Date().toISOString(),
          };
        }
        return module;
      });
      
      console.log("All modules after adding lesson:", updatedModules);
      return updatedModules;
    });
  }, []);

  const updateLesson = useCallback((moduleId, lessonId, updates) => {
    console.log("Updating lesson:", moduleId, lessonId, updates);
    setModules((prev) =>
      prev.map((module) => {
        if (module.id === moduleId) {
          const updatedLessons = (module.lessons || []).map((lesson) =>
            lesson.id === lessonId
              ? { ...lesson, ...updates, updatedAt: new Date().toISOString() }
              : lesson
          );
          return {
            ...module,
            lessons: updatedLessons,
            updatedAt: new Date().toISOString(),
          };
        }
        return module;
      })
    );
  }, []);

  const deleteLesson = useCallback((moduleId, lessonId) => {
    console.log("Deleting lesson:", moduleId, lessonId);
    setModules((prev) =>
      prev.map((module) => {
        if (module.id === moduleId) {
          const filteredLessons = (module.lessons || []).filter(
            (lesson) => lesson.id !== lessonId
          );
          const reorderedLessons = filteredLessons.map((lesson, index) => ({
            ...lesson,
            order: index + 1,
          }));
          return {
            ...module,
            lessons: reorderedLessons,
            updatedAt: new Date().toISOString(),
          };
        }
        return module;
      })
    );
  }, []);

  return {
    modules,
    setModules,
    addModule,
    updateModule,
    deleteModule,
    addLesson,
    updateLesson,
    deleteLesson,
  };
};