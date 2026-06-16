import React from "react";
import FormField from "../ui/FormField";

const PassingCriteriaTab = ({ course, handleCourseChange }) => {
  const rules = course.passingRules || {
    completionPercentage: 80,
    practiceQuizRequired: false,
    moduleAssessmentRequired: true,
    moduleAssessmentPassScore: 70,
    assignmentRequired: false,
    assignmentPassScore: 60,
    finalAssessmentRequired: false,
    certificateScore: 75
  };

  const handleChange = (field, value) => {
    // We store passingRules as an object inside the course state
    handleCourseChange("passingRules", {
      ...rules,
      [field]: value
    });
  };

  return (
    <div className="bg-surface rounded-xl shadow-md border border-border p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">
        Passing Criteria & Assessments
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Completion */}
        <FormField
          label="Minimum Course Completion (%)"
          type="number"
          value={rules.completionPercentage}
          onChange={(value) => handleChange("completionPercentage", parseInt(value, 10))}
          placeholder="e.g. 80"
          required
        />

        {/* Certificate Score */}
        <FormField
          label="Certificate Eligibility Score (%)"
          type="number"
          value={rules.certificateScore}
          onChange={(value) => handleChange("certificateScore", parseInt(value, 10))}
          placeholder="e.g. 75"
          required
        />

        <div className="col-span-full border-t border-border my-4"></div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={rules.practiceQuizRequired}
              onChange={(e) => handleChange("practiceQuizRequired", e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="font-medium text-muted">Require Practice Quizzes</span>
          </label>
          <p className="text-sm text-muted ml-6">Students must complete lesson practice quizzes.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={rules.moduleAssessmentRequired}
              onChange={(e) => handleChange("moduleAssessmentRequired", e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="font-medium text-muted">Require Module Assessments</span>
          </label>
          <p className="text-sm text-muted ml-6">Students must pass module-level assessments.</p>
        </div>

        {rules.moduleAssessmentRequired && (
          <FormField
            label="Module Assessment Pass Score (%)"
            type="number"
            value={rules.moduleAssessmentPassScore}
            onChange={(value) => handleChange("moduleAssessmentPassScore", parseInt(value, 10))}
            placeholder="e.g. 70"
            className="lg:col-start-2"
          />
        )}
        
        {/* Placeholder to keep grid aligned if above isn't shown */}
        {!rules.moduleAssessmentRequired && <div className="lg:col-start-2"></div>}

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={rules.assignmentRequired}
              onChange={(e) => handleChange("assignmentRequired", e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="font-medium text-muted">Require Assignments</span>
          </label>
          <p className="text-sm text-muted ml-6">Students must pass module assignments.</p>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={rules.finalAssessmentRequired}
              onChange={(e) => handleChange("finalAssessmentRequired", e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="font-medium text-muted">Require Final Assessment</span>
          </label>
          <p className="text-sm text-muted ml-6">Students must pass the final course assessment.</p>
        </div>

        {rules.assignmentRequired && (
          <FormField
            label="Assignment Pass Score (%)"
            type="number"
            value={rules.assignmentPassScore}
            onChange={(value) => handleChange("assignmentPassScore", parseInt(value, 10))}
            placeholder="e.g. 60"
            className="lg:col-start-1"
          />
        )}

      </div>
    </div>
  );
};

export default PassingCriteriaTab;
