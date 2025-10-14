import React from "react";

const BasicInfoTab = ({ course, handleCourseChange, errors }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Basic Information
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title *
          </label>
          <input
            type="text"
            value={course.title}
            onChange={(e) => handleCourseChange("title", e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter course title"
            required
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            value={course.category}
            onChange={(e) => handleCourseChange("category", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="web-development">Web Development</option>
            <option value="mobile-development">Mobile Development</option>
            <option value="data-science">Data Science</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
          </select>
        </div>

        {/* Short Description */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description *
          </label>
          <input
            type="text"
            value={course.shortDescription}
            onChange={(e) =>
              handleCourseChange("shortDescription", e.target.value)
            }
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.shortDescription ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Brief description that appears in course cards"
            required
          />
          {errors.shortDescription && (
            <p className="text-red-500 text-sm mt-1">
              {errors.shortDescription}
            </p>
          )}
        </div>

        {/* Full Description */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Description *
          </label>
          <textarea
            value={course.description}
            onChange={(e) => handleCourseChange("description", e.target.value)}
            rows={6}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Detailed course description that appears on the course page"
            required
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Instructor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructor *
          </label>
          <input
            type="text"
            value={course.instructor}
            onChange={(e) => handleCourseChange("instructor", e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.instructor ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Instructor name"
            required
          />
          {errors.instructor && (
            <p className="text-red-500 text-sm mt-1">{errors.instructor}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration *
          </label>
          <input
            type="text"
            value={course.duration}
            onChange={(e) => handleCourseChange("duration", e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.duration ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., 12 hours"
            required
          />
          {errors.duration && (
            <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
          )}
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level *
          </label>
          <select
            value={course.level}
            onChange={(e) => handleCourseChange("level", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language *
          </label>
          <select
            value={course.language}
            onChange={(e) => handleCourseChange("language", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="spanish">Spanish</option>
          </select>
        </div>
      </div>

      {/* Requirements */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Requirements
        </label>
        <textarea
          value={course.requirements?.join("\n") || ""}
          onChange={(e) =>
            handleCourseChange(
              "requirements",
              e.target.value.split("\n").filter((item) => item.trim())
            )
          }
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter each requirement on a new line"
        />
      </div>

      {/* What You'll Learn */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What Students Will Learn
        </label>
        <textarea
          value={course.whatYouLearn?.join("\n") || ""}
          onChange={(e) =>
            handleCourseChange(
              "whatYouLearn",
              e.target.value.split("\n").filter((item) => item.trim())
            )
          }
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter each learning point on a new line"
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
