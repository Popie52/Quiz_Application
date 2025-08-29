import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
        ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    };
    const sizes = {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 py-1.5 text-xs",
        lg: "h-12 px-6 py-3 text-base",
    };
    return <button {...props} className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>{children}</button>
};

const Skeleton = ({ className = '' }) => <div className={`animate-pulse rounded-xl bg-gray-200/70 ${className}`} />;

const AttemptQuiz = () => {
  const { id } = useParams(); // quizId from URL
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/quizzes/${id}`);
        setQuiz(res.data);
      } catch (err) {
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionChange = (questionIndex, selectedIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedIndex,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all questions answered
    if (Object.keys(answers).length !== quiz.questions.length) {
      setError('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/attempts', {
        quizId: quiz._id,
        answers: Object.values(answers), // ordered list of selected option indices
      });

      console.log(res.data.attemptId);
      navigate(`/review/${res.data.attemptId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit attempt');
    } finally {
      setSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    return Math.round((Object.keys(answers).length / (quiz?.questions.length || 1)) * 100);
  };

  const QuizSkeleton = () => (
    <div className="space-y-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <header className="border-b border-white/20 bg-white/80 backdrop-blur-md">
          <nav className="max-w-4xl mx-auto px-6 flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">QuizPlatform</h1>
            </Link>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto py-8 px-6">
          <QuizSkeleton />
        </main>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg p-8 text-center max-w-md">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Quiz Not Found</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/">
            <Button variant="outline">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <nav className="max-w-4xl mx-auto px-6 flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">QuizPlatform</h1>
          </Link>
          
          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              Progress: {Object.keys(answers).length}/{quiz?.questions.length || 0}
            </div>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-6">
        {/* Quiz Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {quiz.category}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {quiz.questions.length} Questions
                </span>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Exit Quiz
              </Button>
            </Link>
          </div>

          {/* Mobile Progress */}
          <div className="sm:hidden mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Object.keys(answers).length}/{quiz.questions.length}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Questions */}
          {quiz.questions.map((q, index) => {
            const isAnswered = answers.hasOwnProperty(index);
            const letters = ['A', 'B', 'C', 'D'];
            
            return (
              <div 
                key={index} 
                className={`bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-sm p-6 transition-all duration-300 ${
                  isAnswered ? 'ring-2 ring-green-200 shadow-md' : 'hover:shadow-lg'
                }`}
              >
                <div className="flex items-start mb-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-semibold mr-4 transition-colors ${
                    isAnswered 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                      {q.questionText}
                    </h3>
                  </div>
                </div>

                <div className="ml-12 space-y-3">
                  {q.options.map((opt, optIndex) => {
                    const isSelected = answers[index] === optIndex;
                    
                    return (
                      <label 
                        key={optIndex} 
                        className={`group flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'bg-blue-50 border-2 border-blue-300' 
                            : 'bg-gray-50/50 border-2 border-transparent hover:bg-blue-50/50 hover:border-blue-200'
                        }`}
                      >
                        <div className="relative flex items-center">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={optIndex}
                            checked={isSelected}
                            onChange={() => handleOptionChange(index, optIndex)}
                            className="sr-only peer"
                            required
                          />
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-500 text-white' 
                              : 'border-gray-300 bg-white text-gray-500 group-hover:border-blue-300'
                          }`}>
                            {letters[optIndex]}
                          </div>
                        </div>
                        <span className={`flex-1 text-sm transition-colors ${
                          isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'
                        }`}>
                          {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Submit Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-600 mb-1">
                  {Object.keys(answers).length} of {quiz.questions.length} questions answered
                </p>
                <div className="w-full sm:w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Link to="/">
                  <Button variant="outline" size="lg">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={submitting || Object.keys(answers).length !== quiz.questions.length}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                >
                  {submitting ? (
                    <>
                      <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Submit Quiz
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AttemptQuiz;