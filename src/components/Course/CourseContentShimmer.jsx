// src/components/CourseContentShimmer.jsx

import React from 'react';
import { global_classnames } from "../../utils/classnames.js";

const CourseContentShimmer = () => {
    return (
        <section className="min-h-screen bg-surface-elevated py-10 animate-pulse">
            <div className={`${global_classnames.width.container} mx-auto px-4 sm:px-6 lg:px-8`}>
                
                {/* Header/Progress Shimmer */}
                <div className="mb-8 bg-surface p-4 rounded-lg shadow-md">
                    <div className="h-8 bg-surface-elevated w-1/3 mb-4"></div>
                    <div className="w-full bg-surface-elevated rounded-full h-2 mb-2"></div>
                    <div className="flex justify-between text-xs">
                        <div className="h-3 bg-surface-elevated w-1/5"></div>
                        <div className="h-3 bg-surface-elevated w-1/6"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Video Player & Description Shimmer */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-surface p-4 rounded-lg shadow-md">
                            <div className="h-6 bg-surface-elevated w-2/3 mb-4"></div>
                            {/* Video Player aspect ratio placeholder */}
                            <div className="aspect-video bg-surface-elevated rounded-lg"></div>
                        </div>
                        
                        {/* Description Shimmer */}
                        <div className="bg-surface p-4 rounded-lg shadow-md space-y-3">
                            <div className="h-5 bg-surface-elevated w-1/4"></div>
                            <div className="h-4 bg-surface-elevated w-full"></div>
                            <div className="h-4 bg-surface-elevated w-5/6"></div>
                            <div className="h-4 bg-surface-elevated w-4/5"></div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Module Navigation Shimmer */}
                    <div className="lg:col-span-1 bg-surface rounded-xl shadow-lg border border-border h-fit">
                        <div className="h-8 bg-gray-300 w-3/4 p-4 border-b rounded-t-xl"></div>
                        <ul className="divide-y divide-border">
                            {[...Array(5)].map((_, index) => (
                                <li key={index} className="p-4 space-y-2">
                                    <div className="h-4 bg-surface-elevated w-1/3"></div>
                                    <div className="h-5 bg-surface-elevated w-3/4"></div>
                                    <div className="h-1 bg-surface-elevated w-full"></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CourseContentShimmer;