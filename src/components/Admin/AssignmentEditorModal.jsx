import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { assessmentsApi } from "../../api/index.js";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";
import FormField from "../ui/FormField.jsx";
import ToastNotification from "../ui/ToastNotification.jsx";

const AssignmentEditorModal = ({ isOpen, onClose, courseId, moduleId, lessonId }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [assignmentId, setAssignmentId] = useState(null);
  
  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    passingScore: 60,
    maxScore: 100
  });
  
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    if (isOpen && courseId) {
      loadAssignment();
    } else {
      setAssignment({
        title: "New Assignment",
        description: "",
        passingScore: 60,
        maxScore: 100
      });
      setAssignmentId(null);
    }
  }, [isOpen, courseId, moduleId, lessonId]);

  const loadAssignment = async () => {
    setLoading(true);
    try {
      const response = await assessmentsApi.getAssignments(courseId, { moduleId, lessonId });
      const assignments = response.data?.data || [];
      const currentAssignment = assignments.find(a => a.moduleId === moduleId && a.lessonId === lessonId);

      if (currentAssignment) {
        setAssignmentId(currentAssignment.id);
        setAssignment({
          title: currentAssignment.title || "",
          description: currentAssignment.description || "",
          passingScore: currentAssignment.passingScore || 60,
          maxScore: currentAssignment.maxScore || 100
        });
      } else {
        setAssignment({
          title: "New Assignment",
          description: "",
          passingScore: 60,
          maxScore: 100
        });
        setAssignmentId(null);
      }
    } catch (error) {
      console.error("Error loading assignment:", error);
      showToast("Failed to load assignment details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!assignment.title || !assignment.description) {
      showToast("Title and Description are required", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: assignment.title,
        description: assignment.description,
        passingScore: parseInt(assignment.passingScore, 10) || 60,
        maxScore: parseInt(assignment.maxScore, 10) || 100,
        moduleId,
        lessonId
      };

      if (assignmentId) {
        await assessmentsApi.updateAssignment(courseId, assignmentId, payload);
      } else {
        const response = await assessmentsApi.createAssignment(courseId, payload);
        if (response.data?.data?.id) {
            setAssignmentId(response.data.data.id);
        }
      }

      showToast("Assignment saved successfully!", "success");
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error("Error saving assignment:", error);
      showToast(error.response?.data?.message || "Failed to save assignment", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-50">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <ToastNotification show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        
        <div className="flex justify-between items-center p-6 border-b border-border bg-background rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-foreground">Assignment Details</h2>
            <p className="text-sm text-muted">
              {assignmentId ? 'Editing existing assignment' : 'Creating new assignment'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-elevated rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-surface">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="space-y-6">
              <FormField
                label="Assignment Title"
                type="text"
                value={assignment.title}
                onChange={(val) => setAssignment({ ...assignment, title: val })}
                required
              />
              
              <FormField
                label="Description & Instructions"
                type="textarea"
                value={assignment.description}
                onChange={(val) => setAssignment({ ...assignment, description: val })}
                rows={6}
                required
                placeholder="Detail what the student needs to do to complete this assignment..."
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Maximum Score"
                  type="number"
                  value={assignment.maxScore}
                  onChange={(val) => setAssignment({ ...assignment, maxScore: val })}
                />
                <FormField
                  label="Passing Score"
                  type="number"
                  value={assignment.passingScore}
                  onChange={(val) => setAssignment({ ...assignment, passingScore: val })}
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-border flex justify-end gap-3 bg-background rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-muted bg-surface border border-border rounded-lg hover:bg-background font-medium">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentEditorModal;
