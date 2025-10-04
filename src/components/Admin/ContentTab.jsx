
import React from 'react';
import { Plus, Trash2, BookOpen } from 'lucide-react';

const ContentTab = ({
    modules,
    handleModuleChange,
    handleLessonChange,
    addModule,
    deleteModule,
    addLesson,
    deleteLesson,
    calculateTotalLessons,
    calculateTotalDuration
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                    <p className="text-gray-600 mt-1">
                        {calculateTotalLessons()} lessons • {calculateTotalDuration()} hours total
                    </p>
                </div>
                <button
                    type="button"
                    onClick={addModule}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Module
                </button>
            </div>

            {modules.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first module</p>
                    <button
                        type="button"
                        onClick={addModule}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add First Module
                    </button>
                </div>
            ) : (
                modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={module.title}
                                    onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                                    className="w-full text-lg font-bold border-none focus:ring-0 p-0 mb-2"
                                    placeholder="Module Title"
                                />
                                <input
                                    type="text"
                                    value={module.description}
                                    onChange={(e) => handleModuleChange(moduleIndex, 'description', e.target.value)}
                                    className="w-full text-gray-600 border-none focus:ring-0 p-0"
                                    placeholder="Module Description"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => deleteModule(moduleIndex)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* Order */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                <input
                                    type="number"
                                    value={module.order}
                                    onChange={(e) => handleModuleChange(moduleIndex, 'order', parseInt(e.target.value) || 1)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    min="1"
                                />
                            </div>
                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <input
                                    type="text"
                                    value={module.duration}
                                    onChange={(e) => handleModuleChange(moduleIndex, 'duration', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="e.g., 2 hours"
                                />
                            </div>
                            {/* Add Lesson Button */}
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={() => addLesson(moduleIndex)}
                                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add Lesson
                                </button>
                            </div>
                        </div>

                        {/* Lessons */}
                        <div className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                                        <div className="md:col-span-4">
                                            <input type="text" value={lesson.title} onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'title', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="Lesson Title"/>
                                        </div>
                                        <div className="md:col-span-2">
                                            <input type="text" value={lesson.duration} onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'duration', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="Duration"/>
                                        </div>
                                        <div className="md:col-span-3">
                                            <select value={lesson.type} onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'type', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                                                <option value="video">Video</option>
                                                <option value="article">Article</option>
                                                <option value="quiz">Quiz</option>
                                                <option value="assignment">Assignment</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-3">
                                            <input type="text" value={lesson.content} onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'content', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg text-sm" placeholder="Content URL/Text"/>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => deleteLesson(moduleIndex, lessonIndex)}
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ContentTab;