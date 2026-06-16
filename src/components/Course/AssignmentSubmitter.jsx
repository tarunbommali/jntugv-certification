import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, Clock, FileText } from 'lucide-react';
import { assessmentsApi } from '../../api/index.js';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';
import ToastNotification from '../ui/ToastNotification.jsx';

const AssignmentSubmitter = ({ courseId, assignmentId, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [fileUrl, setFileUrl] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (courseId && assignmentId) {
      loadAssignmentData();
    }
  }, [courseId, assignmentId]);

  const loadAssignmentData = async () => {
    setLoading(true);
    try {
      // Since we don't have a getAssignment(id) exported to student directly easily, 
      // we can fetch all assignments for course and find it
      const res = await assessmentsApi.getAssignments(courseId);
      const data = res.data?.data || [];
      const current = data.find(a => a.id === assignmentId);
      if (current) setAssignment(current);

      // Fetch submissions
      const subRes = await assessmentsApi.getAssignmentSubmissions(courseId, assignmentId);
      setSubmissions(subRes.data?.data || []);
    } catch (err) {
      console.error("Failed to load assignment data:", err);
      setToast({ show: true, message: 'Failed to load assignment', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!fileUrl) {
      setToast({ show: true, message: 'Please provide a file URL or submission link', type: 'error' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await assessmentsApi.submitAssignment(courseId, assignmentId, fileUrl);
      if (res.data?.success) {
        setSubmissions([...submissions, res.data.data]);
        if (onComplete) onComplete(res.data.data);
        setToast({ show: true, message: 'Assignment submitted successfully!', type: 'success' });
        setFileUrl('');
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setToast({ show: true, message: 'Failed to submit assignment', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><LoadingSpinner /></div>;
  }

  if (!assignment) {
    return <div className="p-8 text-center text-muted">Assignment not found.</div>;
  }

  const latestSubmission = submissions.length > 0 ? submissions[submissions.length - 1] : null;

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm">
      <ToastNotification 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
      
      <div className="p-6 border-b border-border bg-background rounded-t-xl flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-foreground">{assignment.title}</h2>
          </div>
          <p className="text-sm text-muted whitespace-pre-wrap">{assignment.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-muted">Max Score</div>
          <div className="text-lg font-bold text-foreground">{assignment.maxScore}</div>
        </div>
      </div>

      <div className="p-6">
        {latestSubmission ? (
          <div className="border border-green-200 bg-green-50 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-1">Assignment Submitted</h3>
            <p className="text-muted mb-4">Your submission is currently <span className="font-semibold">{latestSubmission.status}</span>.</p>
            
            {latestSubmission.score !== null && (
              <div className="bg-surface border border-green-200 rounded-lg p-4 inline-block mx-auto">
                <div className="text-sm text-muted">Score Received</div>
                <div className="text-2xl font-bold text-green-600">{latestSubmission.score} / {assignment.maxScore}</div>
              </div>
            )}
            
            {latestSubmission.feedback && (
              <div className="mt-4 p-4 bg-surface border border-border rounded-lg text-left">
                <h4 className="text-sm font-bold text-foreground mb-1">Instructor Feedback</h4>
                <p className="text-muted italic">"{latestSubmission.feedback}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Submission URL (Google Drive, GitHub, etc.)
              </label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={submitting || !fileUrl}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {submitting ? <LoadingSpinner size="sm" /> : <Upload className="w-5 h-5" />}
              {submitting ? 'Submitting...' : 'Submit Assignment'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentSubmitter;
