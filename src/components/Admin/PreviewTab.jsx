/* eslint-disable no-unused-vars */
import React from 'react';
import { Clock, Play, FileText, HelpCircle, Image, ListVideo, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';

const PreviewTab = ({ 
  course, 
  modules = [], 
  calculateTotalLessons, 
  calculateTotalDuration,
  totalLessons,
  totalDuration,
  contentType = 'modules' // Add contentType prop to differentiate
}) => {
  
  // Safe calculation functions as fallbacks
  const safeCalculateTotalLessons = (mods) => {
    if (typeof calculateTotalLessons === 'function') {
      return calculateTotalLessons();
    }
    if (totalLessons !== undefined) {
      return totalLessons;
    }
    return mods?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0;
  };

  const safeCalculateTotalDuration = (mods) => {
    if (typeof calculateTotalDuration === 'function') {
      return calculateTotalDuration();
    }
    if (totalDuration !== undefined) {
      return totalDuration;
    }
    return mods?.reduce((total, module) => {
      const match = module.duration?.match(/(\d+)\s*hour/i);
      const moduleHours = match ? parseInt(match[1]) : 0;
      return total + moduleHours;
    }, 0) || 0;
  };

  // Calculate values safely
  const calculatedTotalLessons = safeCalculateTotalLessons(modules);
  const calculatedTotalDuration = safeCalculateTotalDuration(modules);
  const moduleCount = modules?.length || 0;

  // Get lesson icon based on type
  const getLessonIcon = (lessonType) => {
    switch (lessonType) {
      case 'video':
        return <Play className="w-4 h-4 text-blue-600" />;
      case 'article':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-purple-600" />;
      case 'assignment':
        return <FileText className="w-4 h-4 text-orange-600" />;
      default:
        return <Play className="w-4 h-4 text-gray-600" />;
    }
  };

  // Get duration in minutes for display
  const getLessonDuration = (duration) => {
    if (!duration) return 'No duration';
    
    const match = duration.match(/(\d+)\s*min/i);
    if (match) {
      return `${match[1]} min`;
    }
    return duration;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Course Preview</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Course card-like preview */}
        <div className="lg:col-span-1">
          <Card>
            <div className="aspect-video overflow-hidden rounded-t-lg">
              {course?.imageUrl ? (
                <img
                  src={course.imageUrl}
                  alt={course?.title || 'Course Image'}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-1">{course?.title || 'Course Title'}</CardTitle>
              <p className="text-sm text-muted-foreground mb-3">{course?.description || 'Course description will appear here.'}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">₹{course?.price || 0}</span>
                {course?.originalPrice > course?.price && (
                  <span className="text-sm text-muted-foreground line-through">₹{course?.originalPrice}</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Course details styled like CourseDetailsPage */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold mb-1">
                    {course?.title || 'Course Title'}
                  </CardTitle>
                  <p className="text-muted-foreground">{course?.description || 'Course description will appear here.'}</p>
                </div>
                {course?.isBestseller && (
                  <Badge variant="success" className="ml-4">Bestseller</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{course?.duration || `${calculatedTotalDuration} hours`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play size={20} className="text-green-600" />
                  <span className="text-sm text-muted-foreground">{calculatedTotalLessons} Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-purple-600" />
                  <span className="text-sm text-muted-foreground">{moduleCount} {contentType === 'modules' ? 'Modules' : 'Series'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle size={20} className="text-orange-600" />
                  <span className="text-sm text-muted-foreground">{course?.level || 'Beginner'}</span>
                </div>
              </div>

              {/* Course Modules/Series list in CourseDetailsPage style */}
              {modules && modules.length > 0 ? (
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen size={20} />
                    {contentType === 'modules' ? 'Course Modules' : 'Video Series'}
                  </h3>
                  <div className="space-y-3">
                    {modules.map((mod, index) => {
                      const items = Array.isArray(mod.lessons)
                        ? mod.lessons
                        : Array.isArray(mod.videos)
                        ? mod.videos
                        : [];
                      const count = items.length;
                      const noun = contentType === 'modules' ? (count === 1 ? 'lesson' : 'lessons') : (count === 1 ? 'video' : 'videos');
                      return (
                        <div key={mod.id || index} className="border border-border rounded-lg p-4">
                          <h4 className="font-medium mb-2">{mod.title || `Module ${index + 1}`}</h4>
                          <div className="text-sm text-muted-foreground mb-2">{count} {noun}</div>
                          {count > 0 && (
                            <div className="space-y-2">
                              {items.map((item, i) => (
                                <div key={item.id || i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                                  <Play className="w-4 h-4 text-blue-600" />
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">{item.title || `Item ${i + 1}`}</div>
                                    <div className="text-xs text-muted-foreground">{item.duration || '—'}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p>No {contentType === 'modules' ? 'modules' : 'series'} added yet</p>
                  <p className="text-sm mt-1">Add {contentType === 'modules' ? 'modules and lessons' : 'video series'} in the Course Content tab</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PreviewTab;``