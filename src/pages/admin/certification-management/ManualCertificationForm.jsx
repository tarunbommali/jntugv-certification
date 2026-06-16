/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import FormField from "../../../components/ui/FormField.jsx";
import { manualCertificationFormConfig } from "../../../configs/certificationFormConfigs.js";

const ManualCertificationForm = ({
  form,
  setForm,
  onClose,
  onSave,
  loading,
  users,
  courses,
  courseTaskSummaries = {},
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const handleCourseChange = (courseId) => {
    setForm((prev) => {
      const summary = courseTaskSummaries?.[courseId] || {};
      const derivedTotal = Number(summary.totalTasks ?? 0);
      const previousTotal = Number.parseInt(prev.totalTasks, 10) || 0;
      const totalTasks = derivedTotal > 0 ? derivedTotal : previousTotal;
      const previousCompleted = Number.parseInt(prev.completedTasks, 10) || 0;
      const completedTasks = totalTasks > 0
        ? Math.min(totalTasks, previousCompleted)
        : previousCompleted;
      const completionPercentage = totalTasks > 0
        ? Number(((completedTasks / totalTasks) * 100).toFixed(2))
        : prev.completionPercentage;

      return {
        ...prev,
        courseId,
        totalTasks: String(totalTasks),
        completedTasks: String(completedTasks),
        completionPercentage,
      };
    });
  };

  const handleTasksChange = (field, value) => {
    const numericValue = Math.max(0, Number.parseInt(value, 10) || 0);
    
    if (field === 'totalTasks') {
      const completedTasks = Math.min(numericValue, Number.parseInt(form.completedTasks, 10) || 0);
      const completionPercentage = numericValue > 0 ? Number(((completedTasks / numericValue) * 100).toFixed(2)) : 0;
      
      setForm(prev => ({
        ...prev,
        totalTasks: String(numericValue),
        completedTasks: String(completedTasks),
        completionPercentage,
      }));
    } else if (field === 'completedTasks') {
      const totalTasks = Math.max(0, Number.parseInt(form.totalTasks, 10) || 0);
      const limitedCompleted = totalTasks > 0 ? Math.min(totalTasks, numericValue) : numericValue;
      const completionPercentage = totalTasks > 0 ? Number(((limitedCompleted / totalTasks) * 100).toFixed(2)) : 0;
      
      setForm(prev => ({
        ...prev,
        completedTasks: String(limitedCompleted),
        completionPercentage,
      }));
    }
  };

  const selectedCourseSummary = form.courseId ? courseTaskSummaries?.[form.courseId] : null;

  useEffect(() => {
    if (!form.courseId) return;

    const summary = courseTaskSummaries?.[form.courseId];
    if (!summary || summary.totalTasks <= 0) {
      return;
    }

    setForm((prev) => {
      const totalTasks = Number(summary.totalTasks || 0);
      const prevTotal = Number.parseInt(prev.totalTasks, 10) || 0;
      if (totalTasks === prevTotal) {
        return prev;
      }

      const completed = Math.min(
        totalTasks,
        Number.parseInt(prev.completedTasks, 10) || 0,
      );
      const completionPercentage = totalTasks > 0
        ? Number(((completed / totalTasks) * 100).toFixed(2))
        : prev.completionPercentage;

      return {
        ...prev,
        totalTasks: String(totalTasks),
        completedTasks: String(completed),
        completionPercentage,
      };
    });
  }, [courseTaskSummaries, form.courseId, setForm]);

  return (
    <div className="fixed inset-0 bg-background bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Create Manual Certification</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label={manualCertificationFormConfig.userId.label}
            type={manualCertificationFormConfig.userId.type}
            value={form.userId}
            onChange={(value) => setForm({ ...form, userId: value })}
            required={manualCertificationFormConfig.userId.required}
            className="mb-0"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.uid} value={user.uid}>
                {user.username || user.email} ({user.email})
              </option>
            ))}
          </FormField>

          <FormField
            label={manualCertificationFormConfig.courseId.label}
            type={manualCertificationFormConfig.courseId.type}
            value={form.courseId}
            onChange={handleCourseChange}
            required={manualCertificationFormConfig.courseId.required}
            className="mb-0"
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.title} {!course.isPublished && "(Draft)"}
              </option>
            ))}
          </FormField>

          {selectedCourseSummary?.totalTasks > 0 && (
            <div className="text-xs text-muted">
              Detected course tasks: {selectedCourseSummary.totalTasks} (lessons: {selectedCourseSummary.lessonTaskCount}, resources: {selectedCourseSummary.resourceTaskCount})
            </div>
          )}

          <FormField
            label={manualCertificationFormConfig.status.label}
            type={manualCertificationFormConfig.status.type}
            value={form.status}
            onChange={(value) => setForm({ ...form, status: value })}
            className="mb-0"
          >
            {manualCertificationFormConfig.status.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FormField>

          <FormField
            label={manualCertificationFormConfig.overallScore.label}
            type={manualCertificationFormConfig.overallScore.type}
            value={form.overallScore}
            onChange={(value) => setForm({ ...form, overallScore: value })}
            step={manualCertificationFormConfig.overallScore.step}
            min={manualCertificationFormConfig.overallScore.min}
            max={manualCertificationFormConfig.overallScore.max}
            className="mb-0"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label={manualCertificationFormConfig.totalTasks.label}
              type={manualCertificationFormConfig.totalTasks.type}
              value={form.totalTasks}
              onChange={(value) => handleTasksChange('totalTasks', value)}
              min={manualCertificationFormConfig.totalTasks.min}
              className="mb-0"
            />
            <FormField
              label={manualCertificationFormConfig.completedTasks.label}
              type={manualCertificationFormConfig.completedTasks.type}
              value={form.completedTasks}
              onChange={(value) => handleTasksChange('completedTasks', value)}
              min={manualCertificationFormConfig.completedTasks.min}
              className="mb-0"
            />
          </div>

          <div className="p-3 bg-background border border-border rounded-lg">
            <div className="text-sm text-muted">
              <div>Completion: {form.completionPercentage}%</div>
              <div>Tasks: {form.completedTasks} / {form.totalTasks}</div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-muted border border-border rounded-lg hover:bg-background transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.userId || !form.courseId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating..." : "Create Certification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualCertificationForm;