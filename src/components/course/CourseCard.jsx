import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Globe, Star, Award, CheckCircle, Edit } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';

const CourseCard = ({
  course,
  isEnrolled = false,
  showAdminOptions = false,
  className,
  ...props
}) => {
  // Price formatting
  const price = Number(course.price) || 0;
  const originalPrice = Number(course.originalPrice) || (price + 2000);

  // Status color mapping for admin view
  const getStatusVariant = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className={cn('group hover:shadow-lg transition-all duration-300 hover:-translate-y-1', className)} {...props}>
      {/* Course Image */}
      <div className="relative h-40 overflow-hidden rounded-t-lg">
        <img
          src={course.imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUwCJYSnbBLMEGWKfSnWRGC_34iCCKkxePpg&s"}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        <div className="absolute top-3 right-3 bg-black/60 text-white text-sm px-2 py-1 rounded-lg flex items-center font-semibold">
          <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
          {course.rating || '4.5'}
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg leading-snug line-clamp-2">
          {course.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        {/* Course Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock size={16} className="mr-2" />
            <span>{course.duration || 'Self-Paced'}</span>
          </div>
          <div className="flex items-center">
            <Globe size={16} className="mr-2" />
            <span>{course.mode || 'Online'}</span>
          </div>

          {/* Admin-only additional info */}
          {showAdminOptions && (
            <>
              <div className="flex items-center text-xs">
                <span className="font-medium mr-2">Students:</span>
                <span>{course.students || 0}</span>
              </div>
              {course.instructor && (
                <div className="flex items-center text-xs">
                  <span className="font-medium mr-2">Instructor:</span>
                  <span>{course.instructor}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pricing */}
        <div className="mt-4">
          <div className="text-xl font-bold text-foreground">
            ₹{price.toFixed(0)}
            <span className="text-sm text-muted-foreground line-through ml-2 font-normal">
              ₹{originalPrice.toFixed(0)}
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
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link to={`/learn/${course.id}`}>
                <CheckCircle size={16} className="mr-2" />
                Start Learning
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