import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { courses } from "../utils/fallbackData.js";
import { useCourseContext } from "../contexts/CourseContext.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import useCountdownTimer from "../hooks/useCountdownTimer.js";
import CourseDetails from './CourseDetails.jsx'
import { global_classnames } from "../utils/classnames.js";

const CoursePage = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const { getCourseById } = useCourseContext();
  const passedCourse = location.state?.course || null;
  const rawCourse = passedCourse || getCourseById(courseId) || courses.find((c) => String(c.id) === courseId);
  const course = rawCourse ? {
    id: rawCourse.id,
    title: rawCourse.title || 'Course',
    subtitle: rawCourse.subtitle || 'Learn with hands-on content',
    language: rawCourse.language || 'English',
    rating: rawCourse.rating || '4.8/5',
    validity: rawCourse.validity || 'Lifetime access',
    price: rawCourse.price ?? 0,
    originalPrice: rawCourse.originalPrice ?? (rawCourse.price ? rawCourse.price + 2000 : 0),
    discountPercent: rawCourse.discountPercent ?? 20,
    specialDiscount: rawCourse.specialDiscount || 'Limited time offer',
    features: Array.isArray(rawCourse.features) ? rawCourse.features : [
      'Structured modules',
      'Video lessons',
      'Community access'
    ],
    mission: rawCourse.mission || 'Enable students to learn emerging technologies with practical guidance.',
    modules: Array.isArray(rawCourse.modules) ? rawCourse.modules : []
  } : null;
  const formattedTime = useCountdownTimer(9 * 3600 + 17 * 60 + 10);

  if (!course) {
    return (
      <div className={`${global_classnames.width.container} flex items-center justify-center min-h-screen text-center`}>
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
