import React from "react";
import { Link } from "react-router-dom";
import { Clock, Globe, Star, IndianRupee, Award } from "lucide-react";

export default function CourseCard({ course }) {
  const IconComponent = course.icon;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col border border-gray-200 w-[300px] h-[300px]">
      {/* Course Image */}
      <div className="relative h-1/2 overflow-hidden">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUwCJYSnbBLMEGWKfSnWRGC_34iCCKkxePpg&s"
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Bestseller Badge */}
        {course.isBestseller && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <Award size={12} className="mr-1" />
            Bestseller
          </div>
        )}

        {/* Rating Badge (Top Right corner) */}
        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
          <Star size={12} className="fill-yellow-400 text-yellow-400 mr-1" />
          {course.rating} 
          {/* ({(course.ratingCount ?? 0).toLocaleString("en-IN")}) */}
        </div>
      </div>

      {/* Course Content */}
      <div className="flex flex-col p-3 h-1/2 justify-between">
        <h1 className="italic font-semibold text-[#004080] text-sm">
          {course.title}
        </h1>

        {/* Duration and Mode */}
        <div className="flex items-center text-sm text-muted-foreground my-1">
          <Clock size={14} className="mr-2" />
          <span>{course.duration}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground my-1">
          <Globe size={14} className="mr-2" />
          <span>{course.mode}</span>
        </div>

        {/* View Details Button */}
        <Link
          to={`/course/${course.id}`}
          className="w-full bg-primary text-white bg-[#004080]  rounded-4xl text-center px-4 py-2 mt-3 hover:bg-primary/90 transition font-medium text-sm"
        >
          View Course
        </Link>
      </div>
    </div>
  );
}
