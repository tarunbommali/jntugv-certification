// src/components/CourseCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { Clock, Globe, Star, Award, CheckCircle } from "lucide-react";

export default function CourseCard({ course, isEnrolled, onEnroll }) {
    // Determine the enrollment status reliably (true/false). 
    // isEnrolled is passed from CoursePage based on UserContext enrollments.
    const enrolledStatus = isEnrolled; 

    // --- Price Formatting (Ensuring numbers are available) ---
    const price = Number(course.price) || 0;
    const originalPrice = Number(course.originalPrice) || (price + 2000); 

    return (
        <div className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col card w-full sm:w-[300px]">
            
            {/* ... Image, Badges, and Metadata (omitted for brevity) ... */}
            <div className="relative h-40 overflow-hidden">
                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUwCJYSnbBLMEGWKfSnWRGC_34iCCKkxePpg&s" alt={course.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"/>
                {course.isBestseller && (<div className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-md" style={{ background: "var(--color-success)" }}><Award size={14} className="mr-1 fill-white" /> Bestseller</div>)}
                <div className="absolute top-3 right-3 bg-black/60 text-white text-sm px-2 py-1 rounded-lg flex items-center font-semibold"><Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />{course.rating || '4.5'}</div>
            </div>

            <div className="flex flex-col p-4 justify-between flex-grow">
                <h3 className="font-bold text-lg leading-snug mb-2" style={{ color: "var(--color-text)" }}>
                    {course.title}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center"><Clock size={16} className="mr-2 text-gray-500" /><span>{course.duration || 'Self-Paced'}</span></div>
                    <div className="flex items-center"><Globe size={16} className="mr-2 text-gray-500" /><span>{course.mode || 'Online'}</span></div>
                </div>

                {/* Pricing and Action */}
                <div className="mt-4">
                    <div className="text-xl font-extrabold text-gray-900 mb-2">
                        ₹{price.toFixed(0)}
                        <span className="text-sm text-gray-500 line-through ml-2 font-normal">
                            ₹{originalPrice.toFixed(0)} 
                        </span>
                    </div>

                    {/* 🚨 CORRECTED BUTTON LOGIC 🚨 */}
                    {enrolledStatus ? (
                        <Link
                        

                        to={enrolledStatus ? `/learn/${course.id}` : `/course/${course.id}`}
                        className="w-full py-2 flex items-center justify-center rounded-md transition font-semibold text-white shadow-md"
                            style={{ background: "var(--color-success)" }}
                        >
                            <CheckCircle size={16} className="mr-2" /> Start Learning
                        </Link>
                    ) : (
                        // Navigate to the public CourseDetails page (CourseView)
                        <Link 
                            to={`/course/${course.id}`}
                            className="w-full py-2 flex items-center justify-center rounded-md transition font-semibold text-white shadow-md"
                            style={{ background: "var(--color-primary)", color: "var(--color-primary-contrast)" }}
                        >
                            View Course
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}