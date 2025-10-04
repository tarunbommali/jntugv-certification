import React from 'react';
import { Clock, Play, FileText, HelpCircle, Image } from 'lucide-react';

const PreviewTab = ({ course, modules, calculateTotalLessons, calculateTotalDuration }) => {
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
                                {course.imageUrl ? (
                                    <img 
                                        src={course.imageUrl} 
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <Image className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                                {course.isBestseller && (
                                    <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                                        Bestseller
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-black/60 text-white text-sm px-2 py-1 rounded">
                                    4.5 ★
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-lg mb-2">{course.title || 'Course Title'}</h4>
                                <p className="text-gray-600 text-sm mb-3">{course.shortDescription || 'Short description'}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold">₹{course.price}</span>
                                    {course.originalPrice > course.price && (
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
                        <h2 className="text-2xl font-bold mb-4">{course.title || 'Course Title'}</h2>
                        <p className="text-gray-600 mb-6">{course.description || 'Course description will appear here.'}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="text-center">
                                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                <div className="text-sm font-medium">{course.duration || 'N/A'}</div>
                                <div className="text-xs text-gray-500">Duration</div>
                            </div>
                            <div className="text-center">
                                <Play className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                <div className="text-sm font-medium">{calculateTotalLessons()}</div>
                                <div className="text-xs text-gray-500">Lessons</div>
                            </div>
                            <div className="text-center">
                                <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                <div className="text-sm font-medium">{modules.length}</div>
                                <div className="text-xs text-gray-500">Modules</div>
                            </div>
                            <div className="text-center">
                                <HelpCircle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                                <div className="text-sm font-medium">{course.level || 'Beginner'}</div>
                                <div className="text-xs text-gray-500">Level</div>
                            </div>
                        </div>

                        {/* What You'll Learn Preview */}
                        {course.whatYouLearn && course.whatYouLearn.length > 0 && (
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

                        {/* Course Content Preview */}
                        {modules.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-3">Course Content</h4>
                                <div className="space-y-2">
                                    {modules.map((module, index) => (
                                        <div key={index} className="border rounded-lg p-3">
                                            <div className="font-medium">{module.title}</div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {module.lessons.length} lessons • {module.duration}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewTab;