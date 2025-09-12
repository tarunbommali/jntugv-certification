import React from "react";
import { courses } from "../utils/constants";
import CourseCard from "./CourseCard";

export default function Courses() {
  return (
    <section id="courses" className="py-16 bg-background">
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-4xl font-bold md:text-center text-primary mb-10">
          Explore Our Courses
        </h2>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2  bg-white  lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
