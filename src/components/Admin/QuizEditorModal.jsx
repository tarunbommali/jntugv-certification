import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Save, AlertCircle } from "lucide-react";
import { assessmentsApi } from "../../api/index.js";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";
import FormField from "../ui/FormField.jsx";
import ToastNotification from "../ui/ToastNotification.jsx";

const QuizEditorModal = ({ isOpen, onClose, courseId, moduleId, lessonId, isModuleAssessment }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [quizId, setQuizId] = useState(null);
  
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    timeLimitMinutes: 0,
    passingScore: 70,
  });

  const [questions, setQuestions] = useState([]);
  
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    if (isOpen && courseId) {
      loadQuiz();
    } else {
      // Reset state on close
      setQuiz({
        title: isModuleAssessment ? "Module Assessment" : "Practice Quiz",
        description: "",
        timeLimitMinutes: 0,
        passingScore: 70,
      });
      setQuestions([]);
      setQuizId(null);
    }
  }, [isOpen, courseId, moduleId, lessonId]);

  const loadQuiz = async () => {
    setLoading(true);
    try {
      // Find existing quiz
      const response = await assessmentsApi.getQuizzes(courseId, { moduleId, lessonId });
      const existingQuizzes = response.data?.data || [];
      const currentQuiz = existingQuizzes.find(q => 
        q.moduleId === moduleId && 
        (isModuleAssessment ? !q.lessonId : q.lessonId === lessonId)
      );

      if (currentQuiz) {
        setQuizId(currentQuiz.id);
        setQuiz({
          title: currentQuiz.title || "",
          description: currentQuiz.description || "",
          timeLimitMinutes: currentQuiz.timeLimitMinutes || 0,
          passingScore: currentQuiz.passingScore || 70,
        });

        // Load questions
        const quizDetails = await assessmentsApi.getQuiz(courseId, currentQuiz.id);
        if (quizDetails.data?.data?.questions) {
          setQuestions(quizDetails.data.data.questions);
        }
      } else {
        setQuiz({
          title: isModuleAssessment ? "Module Assessment" : "Practice Quiz",
          description: "",
          timeLimitMinutes: 0,
          passingScore: 70,
        });
        setQuestions([]);
        setQuizId(null);
      }
    } catch (error) {
      console.error("Error loading quiz:", error);
      showToast("Failed to load quiz details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!quiz.title) {
      showToast("Quiz title is required", "error");
      return;
    }

    setSaving(true);
    try {
      const quizPayload = {
        title: quiz.title,
        description: quiz.description,
        timeLimitMinutes: parseInt(quiz.timeLimitMinutes, 10) || 0,
        passingScore: parseInt(quiz.passingScore, 10) || 70,
        moduleId,
        lessonId: isModuleAssessment ? null : lessonId,
        type: isModuleAssessment ? 'module_assessment' : 'practice_quiz'
      };

      let currentQuizId = quizId;

      if (currentQuizId) {
        await assessmentsApi.updateQuiz(courseId, currentQuizId, quizPayload);
      } else {
        const response = await assessmentsApi.createQuiz(courseId, quizPayload);
        currentQuizId = response.data?.data?.id;
        setQuizId(currentQuizId);
      }

      // Save questions
      if (currentQuizId) {
        await assessmentsApi.saveQuizQuestions(courseId, currentQuizId, questions);
        showToast("Quiz saved successfully!", "success");
        setTimeout(() => onClose(), 1500);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      showToast(error.response?.data?.message || "Failed to save quiz", "error");
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = (type = 'mcq') => {
    setQuestions([
      ...questions,
      {
        question: "",
        type,
        options: type === 'mcq' ? ["Option 1", "Option 2"] : [],
        correct_indexes: [0],
        explanation: "",
        marks: 1
      }
    ]);
  };

  const updateQuestion = (index, updates) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const renderQuestionEditor = (q, index) => {
    return (
      <div key={index} className="border border-border rounded-lg p-4 mb-4 bg-background">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-muted bg-surface-elevated w-8 h-8 flex items-center justify-center rounded-full">
              {index + 1}
            </span>
            <select
              value={q.type}
              onChange={(e) => updateQuestion(index, { 
                type: e.target.value,
                options: e.target.value === 'mcq' ? ["Option 1", "Option 2"] : e.target.value === 'true_false' ? ["True", "False"] : [],
                correct_indexes: [0]
              })}
              className="border border-border rounded-md p-1 text-sm font-medium bg-surface"
            >
              <option value="mcq">Multiple Choice</option>
              <option value="true_false">True / False</option>
              <option value="fill_blank">Fill in the Blank</option>
            </select>
          </div>
          <button onClick={() => deleteQuestion(index)} className="text-red-500 hover:text-red-700 p-1">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <FormField
            label="Question Text"
            type="textarea"
            value={q.question}
            onChange={(val) => updateQuestion(index, { question: val })}
            placeholder="Enter your question here..."
            required
            rows={2}
          />

          {q.type === 'mcq' && (
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Options</label>
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={q.correct_indexes.includes(optIndex)}
                    onChange={() => updateQuestion(index, { correct_indexes: [optIndex] })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...q.options];
                      newOpts[optIndex] = e.target.value;
                      updateQuestion(index, { options: newOpts });
                    }}
                    className="flex-1 p-2 border border-border rounded-md text-sm"
                    placeholder={`Option ${optIndex + 1}`}
                  />
                  {q.options.length > 2 && (
                    <button
                      onClick={() => {
                        const newOpts = [...q.options];
                        newOpts.splice(optIndex, 1);
                        // Fix correct index if needed
                        let newCorrect = [...q.correct_indexes];
                        if (newCorrect.includes(optIndex)) newCorrect = [0];
                        updateQuestion(index, { options: newOpts, correct_indexes: newCorrect });
                      }}
                      className="p-2 text-muted hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateQuestion(index, { options: [...q.options, `Option ${q.options.length + 1}`] })}
                className="text-sm text-blue-600 font-medium mt-1 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Option
              </button>
            </div>
          )}

          {q.type === 'true_false' && (
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Correct Answer</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={q.correct_indexes[0] === 0}
                    onChange={() => updateQuestion(index, { correct_indexes: [0] })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>True</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={q.correct_indexes[0] === 1}
                    onChange={() => updateQuestion(index, { correct_indexes: [1] })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>False</span>
                </label>
              </div>
            </div>
          )}

          {q.type === 'fill_blank' && (
            <div>
              <FormField
                label="Correct Answer (Exact Match)"
                type="text"
                value={q.options[0] || ""}
                onChange={(val) => updateQuestion(index, { options: [val], correct_indexes: [0] })}
                placeholder="e.g. React"
              />
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1">
              <FormField
                label="Explanation (Optional)"
                type="text"
                value={q.explanation || ""}
                onChange={(val) => updateQuestion(index, { explanation: val })}
                placeholder="Explanation shown after answering"
              />
            </div>
            <div className="w-24">
              <FormField
                label="Marks"
                type="number"
                value={q.marks || 1}
                onChange={(val) => updateQuestion(index, { marks: parseInt(val, 10) || 1 })}
                min="1"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-50">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <ToastNotification show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
        
        <div className="flex justify-between items-center p-6 border-b border-border bg-background rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isModuleAssessment ? "Module Assessment" : "Practice Quiz"}
            </h2>
            <p className="text-sm text-muted">
              {quizId ? 'Editing existing assessment' : 'Creating new assessment'}
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
              {/* Quiz Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    label="Quiz Title"
                    type="text"
                    value={quiz.title}
                    onChange={(val) => setQuiz({ ...quiz, title: val })}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <FormField
                    label="Description"
                    type="textarea"
                    value={quiz.description}
                    onChange={(val) => setQuiz({ ...quiz, description: val })}
                    rows={2}
                  />
                </div>
                <FormField
                  label="Time Limit (Minutes, 0 for unlimited)"
                  type="number"
                  value={quiz.timeLimitMinutes}
                  onChange={(val) => setQuiz({ ...quiz, timeLimitMinutes: val })}
                />
                <FormField
                  label="Passing Score (%)"
                  type="number"
                  value={quiz.passingScore}
                  onChange={(val) => setQuiz({ ...quiz, passingScore: val })}
                />
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-foreground">Questions ({questions.length})</h3>
                  <button
                    onClick={() => addQuestion('mcq')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Question
                  </button>
                </div>

                {questions.length === 0 ? (
                  <div className="text-center p-8 border-2 border-dashed border-border rounded-lg bg-background">
                    <AlertCircle className="w-8 h-8 text-muted mx-auto mb-2" />
                    <p className="text-muted font-medium">No questions added yet.</p>
                    <button
                      onClick={() => addQuestion('mcq')}
                      className="mt-3 text-blue-600 font-medium hover:underline text-sm"
                    >
                      Click here to add your first question
                    </button>
                  </div>
                ) : (
                  <div>
                    {questions.map((q, i) => renderQuestionEditor(q, i))}
                  </div>
                )}
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
            {saving ? 'Saving...' : 'Save Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizEditorModal;
