/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Plus, Trash2, BookOpen, Video, ListOrdered, FileText, Link, Image, Download } from 'lucide-react';
import FormField from '../ui/FormField'; 

const ContentTab = ({
    modules = [], // Add default value
    handleModuleChange,
    handleLessonChange,
    addModule,
    deleteModule,
    addLesson,
    deleteLesson,
    totalLessons,
    totalDuration,
    contentType = 'modules',
    onContentTypeChange,
}) => {
    const [expandedLessons, setExpandedLessons] = useState({});

    const toggleLessonExpansion = (lessonId) => {
        setExpandedLessons(prev => ({
            ...prev,
            [lessonId]: !prev[lessonId]
        }));
    };

    const addResource = (moduleId, lessonId) => {
        const module = modules.find(m => m.id === moduleId);
        if (!module) return;
        
        const lesson = module.lessons?.find(l => l.id === lessonId);
        if (!lesson) return;
        
        const newResource = {
            id: Date.now().toString(),
            type: 'pdf',
            title: '',
            url: '',
            file: null
        };
        
        const updatedResources = [...(lesson.resources || []), newResource];
        handleLessonChange(moduleId, lessonId, { resources: updatedResources });
    };

    const deleteResource = (moduleId, lessonId, resourceId) => {
        const module = modules.find(m => m.id === moduleId);
        if (!module) return;
        
        const lesson = module.lessons?.find(l => l.id === lessonId);
        if (!lesson) return;
        
        const updatedResources = (lesson.resources || []).filter(r => r.id !== resourceId);
        handleLessonChange(moduleId, lessonId, { resources: updatedResources });
    };

    const handleResourceChange = (moduleId, lessonId, resourceId, updates) => {
        const module = modules.find(m => m.id === moduleId);
        if (!module) return;
        
        const lesson = module.lessons?.find(l => l.id === lessonId);
        if (!lesson) return;
        
        const updatedResources = (lesson.resources || []).map(resource =>
            resource.id === resourceId ? { ...resource, ...updates } : resource
        );
        
        handleLessonChange(moduleId, lessonId, { resources: updatedResources });
    };

    const handleFileUpload = (moduleId, lessonId, resourceId, file) => {
        if (!file) return;
        
        const updates = {
            title: file.name,
            url: URL.createObjectURL(file),
            file: file
        };
        handleResourceChange(moduleId, lessonId, resourceId, updates);
    };

    const getResourceIcon = (type) => {
        switch (type) {
            case 'pdf': return <FileText className="w-4 h-4" />;
            case 'link': return <Link className="w-4 h-4" />;
            case 'image': return <Image className="w-4 h-4" />;
            case 'document': return <FileText className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    // Safe array access for modules
    const safeModules = Array.isArray(modules) ? modules : [];

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                    <p className="text-gray-600 mt-1">
                        {totalLessons || 0} lessons • {totalDuration || 0} hours total
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => onContentTypeChange ? onContentTypeChange('modules') : null}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                                contentType === 'modules' 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            Modules
                        </button>
                        <button
                            type="button"
                            onClick={() => onContentTypeChange ? onContentTypeChange('series') : null}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                                contentType === 'series' 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <ListOrdered className="w-4 h-4" />
                            Series
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={addModule}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add {contentType === 'modules' ? 'Module' : 'Series'}
                    </button>
                </div>
            </div>

            {safeModules.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No {contentType === 'modules' ? 'modules' : 'series'} yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Start by adding your first {contentType === 'modules' ? 'module' : 'series'}
                    </p>
                    <button
                        type="button"
                        onClick={addModule}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add First {contentType === 'modules' ? 'Module' : 'Series'}
                    </button>
                </div>
            ) : (
                safeModules.map((module, moduleIndex) => {
                    // Safe array access for lessons
                    const safeLessons = Array.isArray(module.lessons) ? module.lessons : [];
                    
                    return (
                        <div key={module.id || moduleIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1 space-y-3">
                                    <FormField
                                        type="text"
                                        value={module.title || ''}
                                        onChange={(value) => handleModuleChange(module.id, { title: value })}
                                        placeholder={`${contentType === 'modules' ? 'Module' : 'Series'} Title`}
                                        className="mb-0"
                                        inputClassName="text-lg font-bold border-none focus:ring-0 p-0"
                                    />
                                    <FormField
                                        type="text"
                                        value={module.description || ''}
                                        onChange={(value) => handleModuleChange(module.id, { description: value })}
                                        placeholder={`${contentType === 'modules' ? 'Module' : 'Series'} Description`}
                                        className="mb-0"
                                        inputClassName="text-gray-600 border-none focus:ring-0 p-0"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => deleteModule(module.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <FormField
                                    label="Order"
                                    type="number"
                                    value={module.order || 1}
                                    onChange={(value) => handleModuleChange(module.id, { order: parseInt(value) || 1 })}
                                    min="1"
                                    className="mb-0"
                                />
                                <FormField
                                    label="Duration"
                                    type="text"
                                    value={module.duration || ''}
                                    onChange={(value) => handleModuleChange(module.id, { duration: value })}
                                    placeholder="e.g., 2 hours"
                                    className="mb-0"
                                />
                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => addLesson(module.id)}
                                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add {contentType === 'modules' ? 'Lesson' : 'Video'}
                                    </button>
                                </div>
                            </div>

                            {/* Lessons/Videos */}
                            <div className="space-y-3">
                                {safeLessons.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                                        No {contentType === 'modules' ? 'lessons' : 'videos'} added yet. Click "Add {contentType === 'modules' ? 'Lesson' : 'Video'}" to get started.
                                    </div>
                                ) : (
                                    safeLessons.map((lesson, lessonIndex) => {
                                        // Safe array access for resources
                                        const safeResources = Array.isArray(lesson.resources) ? lesson.resources : [];
                                        
                                        return (
                                            <div key={lesson.id || lessonIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                                                {/* Lesson Header */}
                                                <div className="flex items-center gap-4 p-3 bg-gray-50">
                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                                                        <div className="md:col-span-4">
                                                            <FormField
                                                                type="text"
                                                                value={lesson.title || ''}
                                                                onChange={(value) => handleLessonChange(module.id, lesson.id, { title: value })}
                                                                placeholder={`${contentType === 'modules' ? 'Lesson' : 'Video'} Title`}
                                                                className="mb-0"
                                                                inputClassName="text-sm"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <FormField
                                                                type="text"
                                                                value={lesson.duration || ''}
                                                                onChange={(value) => handleLessonChange(module.id, lesson.id, { duration: value })}
                                                                placeholder="Duration"
                                                                className="mb-0"
                                                                inputClassName="text-sm"
                                                            />
                                                        </div>
                                                        <div className="md:col-span-3">
                                                            <FormField
                                                                type="select"
                                                                value={lesson.type || 'video'}
                                                                onChange={(value) => handleLessonChange(module.id, lesson.id, { type: value })}
                                                                className="mb-0"
                                                                inputClassName="text-sm"
                                                            >
                                                                <option value="video">Video</option>
                                                                <option value="article">Article</option>
                                                                <option value="quiz">Quiz</option>
                                                                <option value="assignment">Assignment</option>
                                                            </FormField>
                                                        </div>
                                                        <div className="md:col-span-3">
                                                            <FormField
                                                                type="text"
                                                                value={lesson.content || ''}
                                                                onChange={(value) => handleLessonChange(module.id, lesson.id, { content: value })}
                                                                placeholder="Content URL/Text"
                                                                className="mb-0"
                                                                inputClassName="text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleLessonExpansion(lesson.id)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                                                        >
                                                            {expandedLessons[lesson.id] ? 'Hide Resources' : `Resources (${safeResources.length})`}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteLesson(module.id, lesson.id)}
                                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Resources Section */}
                                                {expandedLessons[lesson.id] && (
                                                    <div className="p-4 bg-white border-t border-gray-200">
                                                        <div className="flex justify-between items-center mb-3">
                                                            <h4 className="font-medium text-gray-900">Resources</h4>
                                                            <button
                                                                type="button"
                                                                onClick={() => addResource(module.id, lesson.id)}
                                                                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                                Add Resource
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="space-y-2">
                                                            {safeResources.length === 0 ? (
                                                                <div className="text-center py-4 text-gray-500">
                                                                    No resources added yet. Click "Add Resource" to attach files, links, or notes.
                                                                </div>
                                                            ) : (
                                                                safeResources.map((resource, resourceIndex) => (
                                                                    <div key={resource.id || resourceIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                                        <div className="flex-shrink-0">
                                                                            {getResourceIcon(resource.type)}
                                                                        </div>
                                                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                                                                            <div className="md:col-span-3">
                                                                                <FormField
                                                                                    type="select"
                                                                                    value={resource.type || 'pdf'}
                                                                                    onChange={(value) => handleResourceChange(module.id, lesson.id, resource.id, { type: value })}
                                                                                    className="mb-0"
                                                                                    inputClassName="text-sm"
                                                                                >
                                                                                    <option value="pdf">PDF</option>
                                                                                    <option value="document">Document</option>
                                                                                    <option value="image">Image</option>
                                                                                    <option value="link">Link</option>
                                                                                    <option value="notes">Notes</option>
                                                                                </FormField>
                                                                            </div>
                                                                            <div className="md:col-span-4">
                                                                                <FormField
                                                                                    type="text"
                                                                                    value={resource.title || ''}
                                                                                    onChange={(value) => handleResourceChange(module.id, lesson.id, resource.id, { title: value })}
                                                                                    placeholder="Resource Title"
                                                                                    className="mb-0"
                                                                                    inputClassName="text-sm"
                                                                                />
                                                                            </div>
                                                                            <div className="md:col-span-4">
                                                                                {resource.type === 'link' ? (
                                                                                    <FormField
                                                                                        type="url"
                                                                                        value={resource.url || ''}
                                                                                        onChange={(value) => handleResourceChange(module.id, lesson.id, resource.id, { url: value })}
                                                                                        placeholder="https://example.com"
                                                                                        className="mb-0"
                                                                                        inputClassName="text-sm"
                                                                                    />
                                                                                ) : (
                                                                                    <input
                                                                                        type="file"
                                                                                        onChange={(e) => handleFileUpload(module.id, lesson.id, resource.id, e.target.files[0])}
                                                                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                                                                        accept={resource.type === 'image' ? 'image/*' : resource.type === 'pdf' ? '.pdf' : '*/*'}
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                            <div className="md:col-span-1">
                                                                                {resource.url && (
                                                                                    <a
                                                                                        href={resource.url}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                                        title="View Resource"
                                                                                    >
                                                                                        <Download className="w-4 h-4" />
                                                                                    </a>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => deleteResource(module.id, lesson.id, resource.id)}
                                                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ContentTab;