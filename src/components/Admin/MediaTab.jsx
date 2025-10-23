/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { Image as ImageIcon, Upload, Eye } from 'lucide-react';
import FormField from '../ui/FormField';

const MediaTab = ({ course, handleCourseChange }) => {
    const fileInputRef = useRef(null);

    const handleFileUpload = (fieldName, file) => {
        if (!file) return;
        
        // Create a blob URL for preview
        const fileUrl = URL.createObjectURL(file);
        handleCourseChange(fieldName, fileUrl);
        
        // You can also upload the file to your server here
        // and update the URL with the server response
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Media & Assets</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Course Image URL with File Upload */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Course Image
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('imageUrl', e.target.files[0])}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={handleImageClick}
                            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Upload className="w-4 h-4" />
                            Upload
                        </button>
                    </div>
                    
                    <FormField
                        type="url"
                        value={course.imageUrl || ''}
                        onChange={(value) => handleCourseChange('imageUrl', value)}
                        placeholder="https://example.com/image.jpg or upload file"
                    />
                    
                    {course.imageUrl && (
                        <div className="mt-2 flex items-center gap-4">
                            <img 
                                src={course.imageUrl} 
                                alt="Course preview" 
                                className="w-32 h-20 object-cover rounded-lg border cursor-pointer"
                                onClick={handleImageClick}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150x100?text=Image+Error';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => window.open(course.imageUrl, '_blank')}
                                className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                View Full Size
                            </button>
                        </div>
                    )}
                </div>

                {/* Promo Video URL */}
                <FormField
                    label="Promo Video URL"
                    type="url"
                    value={course.videoUrl || ''}
                    onChange={(value) => handleCourseChange('videoUrl', value)}
                    placeholder="https://youtube.com/embed/..."
                    helperText="YouTube, Vimeo, or direct video URL"
                />
            </div>

            {/* Tags */}
            <div className="mt-6">
                <FormField
                    label="Tags"
                    type="text"
                    value={course.tags?.join(', ') || ''}
                    onChange={(value) => handleCourseChange('tags', value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                    placeholder="react, javascript, frontend"
                    helperText="Separate tags with commas"
                />
            </div>

            {/* Additional Media Options */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Thumbnail Image */}
                <FormField
                    label="Thumbnail Image URL"
                    type="url"
                    value={course.thumbnailUrl || ''}
                    onChange={(value) => handleCourseChange('thumbnailUrl', value)}
                    placeholder="https://example.com/thumbnail.jpg"
                    helperText="Small image for course cards (150x100)"
                />

                {/* Preview Video */}
                <FormField
                    label="Preview Video URL"
                    type="url"
                    value={course.previewVideoUrl || ''}
                    onChange={(value) => handleCourseChange('previewVideoUrl', value)}
                    placeholder="https://vimeo.com/embed/..."
                    helperText="Short preview video (2-3 minutes)"
                />
            </div>

            {/* Media Preview Section */}
            {(course.imageUrl || course.videoUrl) && (
                <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Media Previews</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Image Preview */}
                        {course.imageUrl && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Course Image Preview</h4>
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <img 
                                        src={course.imageUrl} 
                                        alt="Course preview" 
                                        className="w-full h-48 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x200?text=Image+Error';
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Video Preview */}
                        {course.videoUrl && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Promo Video Preview</h4>
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">Video URL: {course.videoUrl}</p>
                                            <p className="text-xs text-gray-500 mt-1">Video will be embedded on course page</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaTab;