/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Clock, Play, FileText, HelpCircle, Image, ChevronDown, ChevronRight, ListVideo } from 'lucide-react';

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

  // State for collapsible modules
  const [expandedModules, setExpandedModules] = useState({});

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

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
        {/* Course Card Preview */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Course Card</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                {course?.imageUrl ? (
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full ${course?.imageUrl ? 'hidden' : 'flex'} bg-gray-200 items-center justify-center`}>
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
                {course?.isBestseller && (
                  <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                    Bestseller
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black/60 text-white text-sm px-2 py-1 rounded">
                  4.5 ★
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-lg mb-2">{course?.title || 'Course Title'}</h4>
                <p className="text-gray-600 text-sm mb-3">{course?.shortDescription || 'Short description'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">₹{course?.price || 0}</span>
                  {course?.originalPrice > course?.price && (
                    <span className="text-sm text-gray-500 line-through">₹{course.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details Preview */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Course Details</h3>
          <div className="border rounded-lg p-6 bg-gray-50">
            <h2 className="text-2xl font-bold mb-4">{course?.title || 'Course Title'}</h2>
            <p className="text-gray-600 mb-6">{course?.description || 'Course description will appear here.'}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium">{course?.duration || calculatedTotalDuration + ' hours'}</div>
                <div className="text-xs text-gray-500">Duration</div>
              </div>
              <div className="text-center">
                <Play className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium">{calculatedTotalLessons}</div>
                <div className="text-xs text-gray-500">Lessons</div>
              </div>
              <div className="text-center">
                <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium">{moduleCount}</div>
                <div className="text-xs text-gray-500">
                  {contentType === 'modules' ? 'Modules' : 'Series'}
                </div>
              </div>
              <div className="text-center">
                <HelpCircle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-sm font-medium">{course?.level || 'Beginner'}</div>
                <div className="text-xs text-gray-500">Level</div>
              </div>
            </div>

            {/* What You'll Learn Preview */}
            {course?.whatYouLearn && course.whatYouLearn.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">What you'll learn</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {course.whatYouLearn.map((item, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Content Preview - Different layouts for modules vs series */}
            {moduleCount > 0 && (
              <div>
                <h4 className="font-semibold mb-3">
                  Course Content ({contentType === 'modules' ? 'Modules' : 'Video Series'})
                </h4>
                
                {contentType === 'modules' ? (
                  /* MODULES LAYOUT - Collapsible */
                  <div className="space-y-3">
                    {modules.map((module, index) => {
                      const safeLessons = Array.isArray(module.lessons) ? module.lessons : [];
                      const isExpanded = expandedModules[module.id];
                      
                      return (
                        <div key={module.id || index} className="border rounded-lg overflow-hidden">
                          {/* Module Header - Clickable */}
                          <div 
                            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => toggleModule(module.id)}
                          >
                            <div className="flex items-center gap-3">
                              {isExpanded ? 
                                <ChevronDown className="w-4 h-4 text-gray-600" /> : 
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                              }
                              <div>
                                <div className="font-medium text-gray-900">
                                  {module.title || 'Untitled Module'}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {safeLessons.length} {safeLessons.length === 1 ? 'lesson' : 'lessons'} • {module.duration || 'No duration'}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              Module {index + 1}
                            </div>
                          </div>

                          {/* Lessons List - Collapsible */}
                          {isExpanded && safeLessons.length > 0 && (
                            <div className="bg-white border-t">
                              {safeLessons.map((lesson, lessonIndex) => (
                                <div 
                                  key={lesson.id || lessonIndex} 
                                  className="flex items-center gap-4 p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex-shrink-0">
                                    {getLessonIcon(lesson.type)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-sm text-gray-900">
                                      {lesson.title || 'Untitled Lesson'}
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                      <span>{getLessonDuration(lesson.duration)}</span>
                                      <span>•</span>
                                      <span className="capitalize">{lesson.type}</span>
                                      {lesson.isPublished === false && (
                                        <>
                                          <span>•</span>
                                          <span className="text-orange-600">Draft</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {lessonIndex + 1}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* SERIES LAYOUT - Sequential order */
                  <div className="space-y-3">
                    {modules.map((series, seriesIndex) => {
                      const safeLessons = Array.isArray(series.lessons) ? series.lessons : [];
                      
                      return (
                        <div key={series.id || seriesIndex} className="border rounded-lg p-4">
                          {/* Series Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-medium text-gray-900 flex items-center gap-2">
                                <ListVideo className="w-4 h-4 text-blue-600" />
                                {series.title || 'Untitled Series'}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {safeLessons.length} {safeLessons.length === 1 ? 'video' : 'videos'} • {series.duration || 'No duration'}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded">
                              Part {seriesIndex + 1}
                            </div>
                          </div>

                          {/* Videos List - Sequential */}
                          {safeLessons.length > 0 && (
                            <div className="space-y-2">
                              {safeLessons.map((video, videoIndex) => (
                                <div 
                                  key={video.id || videoIndex} 
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                                    {videoIndex + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-sm text-gray-900">
                                      {video.title || 'Untitled Video'}
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                      <Play className="w-3 h-3" />
                                      <span>{getLessonDuration(video.duration)}</span>
                                      {video.isPublished === false && (
                                        <>
                                          <span>•</span>
                                          <span className="text-orange-600">Draft</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {moduleCount === 0 && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p>No {contentType === 'modules' ? 'modules' : 'series'} added yet</p>
                <p className="text-sm mt-1">
                  Add {contentType === 'modules' ? 'modules and lessons' : 'video series'} in the Course Content tab
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewTab;