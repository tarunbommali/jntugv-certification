/* eslint-disable no-unused-vars */
import React from "react";
import FormField from "../ui/FormField";

const BasicInfoTab = ({ course, handleCourseChange, errors }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Basic Information
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Title */}
        <FormField
          label="Course Title"
          type="text"
          value={course.title}
          onChange={(value) => handleCourseChange("title", value)}
          placeholder="Enter course title"
          required
          error={errors.title}
        />

        {/* Category */}
        <FormField
          label="Category"
          type="select"
          value={course.category}
          onChange={(value) => handleCourseChange("category", value)}
          required
        >
          <option value="web-development">Web Development</option>
          <option value="mobile-development">Mobile Development</option>
          <option value="data-science">Data Science</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
        </FormField>

        {/* Short Description */}
        <FormField
          label="Short Description"
          type="text"
          value={course.shortDescription}
          onChange={(value) => handleCourseChange("shortDescription", value)}
          placeholder="Brief description that appears in course cards"
          required
          error={errors.shortDescription}
          className="lg:col-span-2"
        />

        {/* Full Description */}
        <FormField
          label="Full Description"
          type="textarea"
          value={course.description}
          onChange={(value) => handleCourseChange("description", value)}
          placeholder="Detailed course description that appears on the course page"
          required
          error={errors.description}
          rows={6}
          className="lg:col-span-2"
        />

        {/* Instructor */}
        <FormField
          label="Instructor"
          type="text"
          value={course.instructor}
          onChange={(value) => handleCourseChange("instructor", value)}
          placeholder="Instructor name"
          required
          error={errors.instructor}
        />

        {/* Duration */}
        <FormField
          label="Duration"
          type="text"
          value={course.duration}
          onChange={(value) => handleCourseChange("duration", value)}
          placeholder="e.g., 12 hours"
          required
          error={errors.duration}
        />

        {/* Level */}
        <FormField
          label="Level"
          type="select"
          value={course.level}
          onChange={(value) => handleCourseChange("level", value)}
          required
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </FormField>

        {/* Language */}
        <FormField
          label="Language"
          type="select"
          value={course.language}
          onChange={(value) => handleCourseChange("language", value)}
          required
        >
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
          <option value="spanish">Spanish</option>
        </FormField>
      </div>

      {/* Requirements */}
      <div className="mt-6">
        <FormField
          label="Requirements"
          type="textarea"
          value={course.requirements?.join("\n") || ""}
          onChange={(value) =>
            handleCourseChange(
              "requirements",
              value.split("\n").filter((item) => item.trim())
            )
          }
          placeholder="Enter each requirement on a new line"
          rows={3}
        />
      </div>

      {/* What You'll Learn */}
      <div className="mt-6">
        <FormField
          label="What Students Will Learn"
          type="textarea"
          value={course.whatYouLearn?.join("\n") || ""}
          onChange={(value) =>
            handleCourseChange(
              "whatYouLearn",
              value.split("\n").filter((item) => item.trim())
            )
          }
          placeholder="Enter each learning point on a new line"
          rows={3}
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;