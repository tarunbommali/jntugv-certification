// src/components/CourseCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { Clock, Globe, Star, Award, CheckCircle, Edit, Trash2, Eye } from "lucide-react";

function CourseCard({
    course,
    isEnrolled,
    showAdminOptions = false,

}) {
    // Determine the enrollment status reliably (true/false). 
    const enrolledStatus = isEnrolled;

    // --- Price Formatting (Ensuring numbers are available) ---
    const price = Number(course.price) || 0;
    const originalPrice = Number(course.originalPrice) || (price + 2000);

    // Get status color for admin view
    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            case 'archived': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };



    return (
        <div className="rounded-xl mr-2 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col card w-full sm:w-[300px] relative">

            {/* Admin Status Badge */}
            {showAdminOptions && course.status && (
                <div className="absolute top-3 left-3 z-10">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                        {course.status}
                    </span>
                </div>
            )}


            {/* Course Image */}
            <div className="relative h-40 overflow-hidden">
                <img
                    src={course.imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUwCJYSnbBLMEGWKfSnWRGC_34iCCKkxePpg&s"}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* Public Badges */}
                {course.isBestseller && (
                    <div className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-md"
                        style={{ background: "var(--color-success)" }}>
                        <Award size={14} className="mr-1 fill-white" /> Bestseller
                    </div>
                )}

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-black/60 text-white text-sm px-2 py-1 rounded-lg flex items-center font-semibold">
                    <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
                    {course.rating || '4.5'}
                </div>
            </div>

            {/* Course Content */}
            <div className="flex flex-col p-4  justify-between flex-grow">
                <h3 
                 className="font-bold text-lg leading-snug mb-2" 
                 style={{
                     color: "var(--color-text)",
                     whiteSpace: 'nowrap',      
                     overflow: 'hidden',        
                     textOverflow: 'ellipsis'    
                 }}>
                    {course.title}
                </h3>

                <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-gray-500" />
                        <span>{course.duration || 'Self-Paced'}</span>
                    </div>
                    <div className="flex items-center">
                        <Globe size={16} className="mr-2 text-gray-500" />
                        <span>{course.mode || 'Online'}</span>
                    </div>

                    {/* Admin-only additional info */}
                    {showAdminOptions && (
                        <>
                            <div className="flex items-center text-xs">
                                <span className="font-medium mr-2">Students:</span>
                                <span>{course.students || 0}</span>
                            </div>
                            {course.instructor && (
                                <div className="flex items-center text-xs">
                                    <span className="font-medium mr-2">Instructor:</span>
                                    <span>{course.instructor}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Pricing and Action */}
                <div className="mt-4">
                    <div className="text-xl font-extrabold text-gray-800 mb-2">
                        ₹{price.toFixed(0)}
                        <span className="text-sm text-gray-500 line-through ml-2 font-normal">
                            ₹{originalPrice.toFixed(0)}
                        </span>
                    </div>

                    {/* Action Button - Different behavior for admin vs public */}
                    {showAdminOptions ? (
                        // Admin view - Show management options
                        <div className="flex gap-2">
                             <Link
                                to={`/admin/courses/edit/${course.id}`}
                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                <Edit className="w-3 h-3" />
                                Edit
                            </Link>
                        </div>
                    ) : (
                        // Public view - Normal enrollment flow
                        enrolledStatus ? (
                            <Link
                                to={`/learn/${course.id}`}
                                className="w-full py-2 flex items-center justify-center rounded-md transition font-semibold text-white shadow-md hover:opacity-90"
                                style={{ background: "var(--color-success)" }}
                            >
                                <CheckCircle size={16} className="mr-2" /> Start Learning
                            </Link>
                        ) : (
                            <Link
                                to={`/course/${course.id}`}
                                className="w-full py-2 flex items-center justify-center rounded-md transition font-semibold text-white shadow-md hover:opacity-90"
                                style={{ background: "var(--color-primary)", color: "var(--color-primary-contrast)" }}
                            >
                                View Course
                            </Link>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}


export default CourseCard;