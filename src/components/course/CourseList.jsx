import React from 'react';
import CourseCard from './CourseCard';
import { Alert, AlertDescription } from '../ui/Alert';
import LoadingSpinner from '../ui/LoadingSpinner';
import { cn } from '../../utils/cn';

const CourseList = ({ 
  courses = [], 
  loading = false, 
  error = null, 
  showAdminOptions = false,
  enrollmentStatus = {},
  className,
  ...props 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/50 border border-border rounded-lg">
        <p className="text-lg text-muted-foreground font-medium">
          No courses are currently available. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
        className
      )}
      {...props}
    >
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          isEnrolled={enrollmentStatus[course.id] || false}
          showAdminOptions={showAdminOptions}
        />
      ))}
    </div>
  );
};

export default CourseList;