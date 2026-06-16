/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Globe, Star, Award, CheckCircle, Edit } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';
import { formatINR, toNumber } from '../../utils/currency';

const CourseCard = ({
  course,
  isEnrolled = false,
  showAdminOptions = false,
  className,
  ...props
}) => {
  // Price formatting
  const price = toNumber(course.price, 0);
  const originalPrice = toNumber(course.originalPrice, price + 2000);

  // Status color mapping for admin view
  const getStatusVariant = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'destructive';
      default: return 'secondary';
    }
  };

  const DEFAULT_COURSE_IMAGE = "https://placehold.co/400x250/e2e8f0/1e293b?text=Course+Preview";
  const courseImage = course.imageUrl || course.thumbnail || DEFAULT_COURSE_IMAGE;
  const avgRating = course.averageRating ? course.averageRating.toFixed(1) : 'New';
  const totalReviews = course.totalRatings || 0;

  return (
    <Card className={cn('group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full', className)} {...props}>
      {/* Course Image */}
      <div className="relative h-40 overflow-hidden rounded-t-lg flex-shrink-0">
        <img
          src={courseImage}
          alt={course.title || "Course"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 bg-surface-elevated"
          onError={(e) => { e.target.src = DEFAULT_COURSE_IMAGE; }}
        />

        {/* Admin Status Badge */}
        {showAdminOptions && course.status && (
          <Badge 
            variant={getStatusVariant(course.status)}
            className="absolute top-3 left-3 z-10"
          >
            {course.status}
          </Badge>
        )}

        {/* Public Badges */}
        {course.isBestseller && (
          <Badge 
            variant="success"
            className="absolute top-3 left-3 text-white bg-green-600 hover:bg-green-700"
          >
            <Award size={14} className="mr-1" />
            Bestseller
          </Badge>
        )}

        {/* Rating Badge */}
        <div 
          className="absolute top-3 right-3 text-white text-sm px-2 py-1 rounded-lg flex items-center font-semibold shadow-sm"
          style={{ background: "var(--color-textLow)", backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
          {avgRating} {totalReviews > 0 ? `(${totalReviews})` : ''}
        </div>
      </div>

      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg leading-snug line-clamp-2" title={course.title || 'Untitled Course'}>
          {course.title || <span className="text-muted italic">Untitled Course</span>}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 pb-3 flex-grow">
        {/* Course Details */}
        <div className="space-y-2 text-sm text-medium">
          <div className="flex items-center">
            <Clock size={16} className="mr-2 flex-shrink-0" />
            <span className="truncate">{course.duration || 'Self-Paced'}</span>
          </div>
          <div className="flex items-center">
            <Globe size={16} className="mr-2 flex-shrink-0" />
            <span className="truncate">{course.mode || 'Online'}</span>
          </div>

          {/* Admin-only additional info */}
          {showAdminOptions && (
            <>
              <div className="flex items-center text-xs">
                <span className="font-medium mr-2">Students:</span>
                <span>{course.students || 0}</span>
              </div>
              <div className="flex items-center text-xs">
                <span className="font-medium mr-2">Instructor:</span>
                <span className="truncate">{course.instructor || <span className="text-muted italic">Not specified</span>}</span>
              </div>
            </>
          )}
        </div>

        {/* Pricing */}
        <div className="mt-4">
          <div className="text-xl font-bold text-high">
            {formatINR(price)}
            <span className="text-sm text-low line-through ml-2 font-normal">
              {formatINR(originalPrice)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {showAdminOptions ? (
          // Admin view - Show management options
          <Button asChild className="w-full">
            <Link to={`/admin/courses/edit/${course.id}`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Course
            </Link>
          </Button>
        ) : (
          // Public view - Normal enrollment flow
          isEnrolled ? (
            <Button asChild variant="success" className="w-full">
              <Link to={`/learn/${course.id}`}>
                <CheckCircle size={16} className="mr-2" />
                Continue Learning
              </Link>
            </Button>
          ) : (
            <Button asChild className="w-full">
              <Link to={`/course/${course.id}`}>
                View Course
              </Link>
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;