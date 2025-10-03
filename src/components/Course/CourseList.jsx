import React from "react";
// 🚨 Context Import (Assuming this provides course list, loading, and error)
import { useCourseContext } from "../../contexts/CourseContext.jsx"; 
// 🚨 Fallback Import (Renamed to be distinct from the context courses variable)
import { courses as fallbackCourses } from "../../utils/fallbackData.js";
import CourseCard from "./CourseCard.jsx";
import { global_classnames } from "../../utils/classnames.js";

function CourseList() {
    // 1. Access data from context
    // NOTE: If you don't have a specific CourseContext, you might use useCourseContent()
    // and access a fullCourseList property from there.
    const { 
        courses: contextCourses, 
        loading: contextLoading, 
        error: contextError 
    } = useCourseContext();

    // 2. Determine the final course list: ContextCourses OR FallbackCourses
    // We use contextCourses if they exist and there's no fatal error.
    const finalCourses = (contextCourses?.length > 0 && !contextError) 
        ? contextCourses 
        : fallbackCourses;

    // 3. Determine the loading state
    const isLoading = contextLoading;
    
    // Define the primary color (assuming 'text-primary' resolves to a color)
    const PRIMARY_BLUE = "#004080"; 

    // --- Loading State ---
    if (isLoading) {
        return (
            <section id="courses" className="py-16 bg-background">
                <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8 text-center`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Shimmer Placeholder (4 cards for the grid) */}
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="animate-pulse bg-gray-200 h-64 rounded-xl shadow-lg"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }
    
    // --- Error State (If context failed and fallback is empty/missing, which shouldn't happen) ---
    if (!finalCourses || finalCourses.length === 0) {
         return (
            <section id="courses" className="py-16 bg-background">
                <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8 text-center`}>
                    <h2 className="text-2xl sm:text-4xl font-bold md:text-center text-red-600 mb-10">
                        Courses Unavailable 😥
                    </h2>
                    <p className="text-lg text-gray-600">We could not load any courses at this time.</p>
                </div>
            </section>
        );
    }


    // --- Success State (Using Context Data or Fallback Data) ---
    return (
        <section id="courses" className="py-16 bg-background">
            <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}>
                
                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 bg-white lg:grid-cols-4 gap-6">
                    {finalCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </section>
    );
}


export default CourseList;