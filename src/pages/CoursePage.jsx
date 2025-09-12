import React from "react";
import { useParams } from "react-router-dom";
import { courses } from "../utils/constants";
import Breadcrumbs from "../components/Breadcrumbs";
import useCountdownTimer from "../hooks/useCountdownTimer";
import CourseDetails from './CourseDetails'

const CoursePage = () => {
  const { courseId } = useParams();
  const course = courses.find((c) => String(c.id) === courseId);
  const formattedTime = useCountdownTimer(9 * 3600 + 17 * 60 + 10);

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-semibold text-red-600">Course not found.</h2>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: course.title },
  ];

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <CourseDetails course={course} formattedTime={formattedTime} />
    </div>
  );
};

export default CoursePage;
