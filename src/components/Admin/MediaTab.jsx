import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

const MediaTab = ({ course, handleCourseChange }) => {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Media & Assets</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Course Image URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Image URL</label>
                    <input
                        type="url"
                        value={course.imageUrl}
                        onChange={(e) => handleCourseChange('imageUrl', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com/image.jpg"
                    />
                    {course.imageUrl && (
                        <div className="mt-2">
                            <img 
                                src={course.imageUrl} 
                                alt="Course preview" 
                                className="w-32 h-20 object-cover rounded-lg border"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150x100?text=Image+Error';
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Promo Video URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Promo Video URL</label>
                    <input
                        type="url"
                        value={course.videoUrl}
                        onChange={(e) => handleCourseChange('videoUrl', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://youtube.com/embed/..."
                    />
                </div>
            </div>

            {/* Tags */}
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                    type="text"
                    value={course.tags?.join(', ') || ''}
                    onChange={(e) => handleCourseChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="react, javascript, frontend"
                />
                <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
            </div>
        </div>
    );
};

export default MediaTab;