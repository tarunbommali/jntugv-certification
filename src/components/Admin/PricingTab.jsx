/* eslint-disable no-unused-vars */
import React from "react";
import FormField from "../ui/FormField";

const PricingTab = ({ course, handleCourseChange, errors }) => {
  const currentPrice = Number(course.price ?? 0) || 0;
  const originalPrice = Number(course.originalPrice ?? 0) || 0;

  const discountPercent =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  return (
    <div className="bg-surface rounded-xl shadow-md border border-border p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">
        Pricing & Discounts
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Price */}
        <FormField
          label="Current Price (₹) *"
          type="number"
          value={course.price ?? ""}
          onChange={(value) =>
            handleCourseChange(
              "price",
              value === "" ? "" : Number(value)
            )
          }
          error={errors.price}
          required
          min="0"
        />

        {/* Original Price */}
        <FormField
          label="Original Price (₹)"
          type="number"
          value={course.originalPrice ?? ""}
          onChange={(value) =>
            handleCourseChange(
              "originalPrice",
              value === "" ? "" : Number(value)
            )
          }
          min="0"
        />

        {/* Discount Calculation */}
        {originalPrice > currentPrice && (
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-6 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm">
                <span className="font-medium">Discount: </span>
                <span className="text-green-600 font-bold">
                  {discountPercent}%
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">You Save: </span>
                <span className="text-green-600 font-bold">
                  ₹{originalPrice - currentPrice}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Status with FormField checkboxes */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Published"
          type="checkbox"
          value={course.isPublished}
          onChange={(value) => handleCourseChange("isPublished", value)}
          className="flex items-center space-x-2"
        />

        <FormField
          label="Featured"
          type="checkbox"
          value={course.isFeatured}
          onChange={(value) => handleCourseChange("isFeatured", value)}
          className="flex items-center space-x-2"
        />

        <FormField
          label="Bestseller"
          type="checkbox"
          value={course.isBestseller}
          onChange={(value) => handleCourseChange("isBestseller", value)}
          className="flex items-center space-x-2"
        />
      </div>
    </div>
  );
};

export default PricingTab;
