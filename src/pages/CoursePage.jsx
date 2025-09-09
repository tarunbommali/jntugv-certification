import React from "react";
import { useParams, Link } from "react-router-dom";
import { courses } from "../utils/constants";
import { global_classnames } from "../utils/classnames";
import ModulesSection from "../components/ModulesSection";
import useCountdownTimer from "../hooks/useCountdownTimer"; 
import { IoIosArrowForward } from "react-icons/io";

const CoursePage = () => {
  const { courseId } = useParams();
  const course = courses.find((c) => String(c.id) === courseId);

  // Initialize timer with 9 hours, 17 minutes, and 10 seconds
  const formattedTime = useCountdownTimer(9 * 3600 + 17 * 60 + 10);

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-semibold text-red-600">
          Course not found.
        </h2>
      </div>
    );
  }

  const IconComponent = course.icon;

  return (
    <div className="max-w-7xl mx-auto p-8  bg-white">
      {/* Breadcrumbs */}
      <nav className="text-sm flex items-center text-gray-600 mb-6">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <IoIosArrowForward size={14} classeName="mx-2 ml-2"/> <span className="font-medium text-gray-800">{course.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Side */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center mb-4">
            <div
              className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mr-4"
              style={{ border: global_classnames.container.border }}
            >
              <IconComponent className="h-7 w-7 text-[#004080]" />
            </div>
            <h1 className="text-3xl font-bold text-left">{course.title}</h1>
          </div>

          <p className="text-muted-foreground text-lg">{course.subtitle}</p>

          <div className="text-sm text-muted-foreground mb-4">
            <strong>Language:</strong> {course.language} <br />
            <strong>Rating:</strong> {course.rating} <br />
            <strong>Validity:</strong> {course.validity}
          </div>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            {course.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>

        {/* Right Side */}
        <div className="flex-1 space-y-6">
          <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
            <span className="text-xl text-gray-700">Video Preview Placeholder</span>
          </div>

          <div className="bg-gray-100 p-4 rounded space-y-3">
            <div className="text-xl font-semibold text-primary">
              ₹{course.price} + GST
            </div>
            <div>
              <span className="line-through text-muted-foreground mr-2">
                ₹{course.originalPrice}
              </span>
              <span className="text-green-600 font-semibold">
                {course.discountPercent}% OFF
              </span>
            </div>
            <div className="text-lg font-semibold text-red-600">
              Special Discount: {course.specialDiscount}
            </div>
            <div className="text-sm bg-gray-200 p-2 rounded text-center font-mono">
              ⏱ {formattedTime}
            </div>

            <button className="w-full bg-primary text-white bg-green-800 px-4 py-2 rounded hover:bg-primary/90 transition">
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mt-10 p-6 bg-gray-50 rounded shadow">
        <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
        <p className="text-gray-700">{course.mission}</p>
      </div>

      <ModulesSection />
    </div>
  );
};

export default CoursePage;
