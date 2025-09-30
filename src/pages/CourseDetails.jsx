import React from "react";
import { FaLanguage, FaStar, FaClock } from "react-icons/fa";
import ModulesSection from "../components/ModulesSection";
import { global_classnames } from "../utils/classnames.js";
import { Link } from "react-router-dom";

const CourseDetails = ({ course, formattedTime }) => {
  const modules = course.modules || [];

  return (
    <div className={`${global_classnames.width.container} mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg`}>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">

        {/* Preview + Pricing (Right Column on large screens, Top on small screens) */}
        <div className="order-1 lg:order-2 space-y-6">
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-4 md:mb-6">
            <img
              className="h-48 object-cover rounded"
              src="https://img.freepik.com/free-vector/video-design-abstract-concept-illustration_335657-2138.jpg"
              alt="Course Preview"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-[#192f60] my-2">
            <div className="flex items-center gap-2">
              <FaLanguage className="text-primary" />
              <span className="text-sm md:text-base">{course.language}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              <span className="text-sm md:text-base">{course.rating}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaClock className="text-blue-500" />
              <span className="text-sm md:text-base">{course.validity}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow space-y-4">
            <div className="text-2xl md:text-3xl font-bold text-primary">
              ₹{course.price} + GST
            </div>
            <div className="flex items-center space-x-2">
              <span className="line-through text-gray-500 text-sm md:text-base">
                ₹{course.originalPrice}
              </span>
              <span className="text-green-600 font-semibold text-sm md:text-base">
                {course.discountPercent}% OFF
              </span>
            </div>
            <div className="text-lg font-semibold text-red-600">
              Special Discount: {course.specialDiscount}
            </div>
            <div className="bg-gray-100 text-center font-mono p-2 rounded text-sm">
              ⏱ {formattedTime}
            </div>
            <Link to={`/checkout/${course.id}`} className="w-full bg-primary text-white bg-green-700 px-4 py-2 rounded hover:bg-primary/90 transition">
              Enroll Now
            </Link>
          </div>
        </div>

        {/* Course Info + Modules (Left Column on large screens, Bottom on small screens) */}
        <div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
          <h1 className="text-xl md:text-4xl font-semibold text-gray-800">
            {course.title}
          </h1>
          <p className="text-md md:text-lg text-gray-600">{course.subtitle}</p>

          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {course.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>

          <div className="mt-4 md:mt-8 p-4 md:bg-gray-50 rounded shadow">
            <h2 className="text-2xl font-semibold text-primary">Our Mission</h2>
            <p className="text-gray-700 mt-2">{course.mission}</p>
          </div>

          <ModulesSection modules={modules} />
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
