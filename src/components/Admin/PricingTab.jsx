import React from 'react';

const PricingTab = ({ course, handleCourseChange, errors }) => {
    const discountPercent = course.originalPrice > course.price 
        ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) 
        : 0;

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Pricing & Discounts</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Price (₹) *</label>
                    <input
                        type="number"
                        value={course.price}
                        onChange={(e) => handleCourseChange('price', parseInt(e.target.value) || 0)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                        min="0"
                        required
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                {/* Original Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                    <input
                        type="number"
                        value={course.originalPrice}
                        onChange={(e) => handleCourseChange('originalPrice', parseInt(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                    />
                </div>

                {/* Discount Calculation */}
                {course.originalPrice > course.price && (
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-6 p-4 bg-blue-50 rounded-lg">
                            <div className="text-sm">
                                <span className="font-medium">Discount: </span>
                                <span className="text-green-600 font-bold">{discountPercent}%</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">You Save: </span>
                                <span className="text-green-600 font-bold">₹{course.originalPrice - course.price}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Course Status */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isPublished"
                        checked={course.isPublished}
                        onChange={(e) => handleCourseChange('isPublished', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">Published</label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isFeatured"
                        checked={course.isFeatured}
                        onChange={(e) => handleCourseChange('isFeatured', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">Featured</label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isBestseller"
                        checked={course.isBestseller}
                        onChange={(e) => handleCourseChange('isBestseller', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isBestseller" className="ml-2 block text-sm text-gray-900">Bestseller</label>
                </div>
            </div>
        </div>
    );
};

export default PricingTab;