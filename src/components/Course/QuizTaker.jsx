import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { assessmentsApi } from '../../api/index.js';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';
import ToastNotification from '../ui/ToastNotification.jsx';

const QuizTaker = ({ courseId, quizId, onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (courseId && quizId) {
      loadQuizData();
    }
  }, [courseId, quizId]);

  const loadQuizData = async () => {
    setLoading(true);
    try {
      // Fetch quiz
      const res = await assessmentsApi.getQuiz(courseId, quizId);
      const quizData = res.data?.data;
      if (quizData) {
        setQuiz(quizData);
        setQuestions(quizData.questions || []);
      }

      // Fetch attempts
      const attemptsRes = await assessmentsApi.getQuizAttempts(courseId, quizId);
      const pastAttempts = attemptsRes.data?.data || [];
      if (pastAttempts.length > 0) {
        // Show highest or latest result
        const bestAttempt = pastAttempts.reduce((prev, current) => (prev.score > current.score) ? prev : current);
        setResult(bestAttempt);
      }
    } catch (err) {
      console.error("Failed to load quiz data:", err);
      setToast({ show: true, message: 'Failed to load quiz', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, value, isMulti = false) => {
    setAnswers(prev => {
      const current = prev[questionIndex];
      if (isMulti) {
        let newArr = Array.isArray(current) ? [...current] : [];
        if (newArr.includes(value)) {
          newArr = newArr.filter(v => v !== value);
        } else {
          newArr.push(value);
        }
        return { ...prev, [questionIndex]: newArr };
      }
      return { ...prev, [questionIndex]: [value] };
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      if (!window.confirm("You have unanswered questions. Are you sure you want to submit?")) {
        return;
      }
    }

    setSubmitting(true);
    try {
      // Map answers object to array matching questions order
      const answersArray = questions.map((_, i) => answers[i] || []);
      
      const res = await assessmentsApi.submitQuizAttempt(courseId, quizId, answersArray);
      if (res.data?.success) {
        setResult(res.data.data);
        if (onComplete) onComplete(res.data.data);
        setToast({ show: true, message: 'Quiz submitted successfully!', type: 'success' });
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setToast({ show: true, message: 'Failed to submit quiz', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><LoadingSpinner /></div>;
  }

  if (!quiz) {
    return <div className="p-8 text-center text-muted">Quiz not found.</div>;
  }

  // If user already took the quiz and passed, or reached max attempts
  if (result && result.passed) {
    return (
      <div className="bg-surface rounded-xl border border-green-200 shadow-sm p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Passed!</h2>
        <p className="text-lg text-muted mb-6">
          You scored <span className="font-bold text-foreground">{result.percentage}%</span>
        </p>
        <button 
          onClick={() => setResult(null)} 
          className="px-6 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100"
        >
          Take Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm">
      <ToastNotification 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
      
      <div className="p-6 border-b border-border bg-background rounded-t-xl flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-foreground">{quiz.title}</h2>
          {quiz.description && <p className="text-sm text-muted mt-1">{quiz.description}</p>}
        </div>
        {quiz.timeLimitMinutes > 0 && (
          <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg font-medium">
            <Clock className="w-4 h-4" />
            <span>{quiz.timeLimitMinutes} min limit</span>
          </div>
        )}
      </div>

      {result && !result.passed && (
        <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-800">You did not pass this time.</h3>
            <p className="text-red-700">Your score: {result.percentage}%. Required: {quiz.passingPercentage}%.</p>
          </div>
        </div>
      )}

      <div className="p-6 space-y-8">
        {questions.map((q, index) => {
          const qData = q.questionJson || {};
          const isMultipleChoice = qData.type === 'mcq';
          const isTrueFalse = qData.type === 'true_false';
          const isFillBlank = qData.type === 'fill_blank';
          const currentAnswer = answers[index] || [];

          return (
            <div key={q.id || index} className="space-y-4">
              <div className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground text-lg leading-snug">{qData.question}</h3>
                  {qData.marks > 1 && <span className="text-xs text-muted font-medium">{qData.marks} Points</span>}
                </div>
              </div>

              <div className="pl-11 space-y-2">
                {isMultipleChoice && qData.options?.map((opt, optIndex) => (
                  <label key={optIndex} className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-background cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={currentAnswer.includes(optIndex)}
                      onChange={() => handleAnswerChange(index, optIndex, false)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-muted">{opt}</span>
                  </label>
                ))}

                {isTrueFalse && (
                  <div className="flex gap-4">
                    <label className="flex-1 flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-background cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        checked={currentAnswer.includes(0)}
                        onChange={() => handleAnswerChange(index, 0)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-muted font-medium">True</span>
                    </label>
                    <label className="flex-1 flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-background cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        checked={currentAnswer.includes(1)}
                        onChange={() => handleAnswerChange(index, 1)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-muted font-medium">False</span>
                    </label>
                  </div>
                )}

                {isFillBlank && (
                  <input
                    type="text"
                    value={currentAnswer[0] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 border-t border-border bg-background rounded-b-xl flex justify-between items-center">
        <span className="text-sm text-muted font-medium">
          {Object.keys(answers).length} of {questions.length} answered
        </span>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizTaker;
