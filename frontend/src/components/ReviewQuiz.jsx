

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const ReviewQuiz = () => {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await API.get(`/attempts/review/${attemptId}`);
        setAttempt(res.data);
      } catch (err) {
        setError('Failed to load attempt review');
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [attemptId]);

  const getScorePercentage = () => {
    if (!attempt) return 0;
    return Math.round((attempt.score / attempt.totalQuestions) * 100);
  };

  const getScoreColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return 'from-green-500 to-emerald-500';
    if (percentage >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const ReviewSkeleton = () => (
    <div className="space-y-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-12 w-1/3" />
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <Skeleton className="h-6 w-3/4 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
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
          <ReviewSkeleton />
        </main>
      </div>
    );
  }

  if (error && !attempt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-lg p-8 text-center max-w-md">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Not Found</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/">
            <Button variant="outline">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { score, totalQuestions, review } = attempt;
  const percentage = getScorePercentage();

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
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm text-gray-600">
              Quiz Review
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                Dashboard
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-6">
        {/* Results Summary */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-sm p-8 mb-8 text-center">
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${getScoreGradient()} text-white text-2xl font-bold mb-4 shadow-lg`}>
              {percentage}%
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-lg text-gray-600">
              You scored <span className={`font-semibold ${getScoreColor()}`}>{score} out of {totalQuestions}</span> questions correctly
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-500">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{totalQuestions - score}</div>
              <div className="text-sm text-gray-500">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{totalQuestions}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>

        {/* Performance Badge */}
        <div className="flex justify-center mb-8">
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            percentage >= 80 ? 'bg-green-100 text-green-800' :
            percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {percentage >= 80 ? '🎉 Excellent!' : 
             percentage >= 60 ? '👍 Good Job!' : 
             '📚 Keep Practicing!'}
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Detailed Review
          </h3>

          {review.map((q, index) => {
            const correct = q.correctAnswerIndex;
            const selected = q.selectedAnswerIndex;
            const isCorrect = selected === correct;
            const letters = ['A', 'B', 'C', 'D'];

            return (
              <div 
                key={index} 
                className={`bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-sm p-6 transition-all duration-300 ${
                  isCorrect ? 'ring-2 ring-green-200' : 'ring-2 ring-red-200'
                }`}
              >
                <div className="flex items-start mb-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-semibold mr-4 ${
                    isCorrect 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 leading-relaxed mb-2">
                      {q.questionText}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm">
                      {isCorrect ? (
                        <span className="flex items-center text-green-600 font-medium">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Correct Answer
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 font-medium">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Incorrect Answer
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="ml-12 space-y-2">
                  {q.options.map((opt, optIndex) => {
                    const isCorrectOption = optIndex === correct;
                    const isSelectedOption = optIndex === selected;
                    
                    let optionStyle = 'bg-gray-50 border-gray-200 text-gray-700';
                    let iconElement = null;
                    
                    if (isCorrectOption && isSelectedOption) {
                      // Correct answer that was selected
                      optionStyle = 'bg-green-50 border-green-300 text-green-800';
                      iconElement = (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      );
                    } else if (isCorrectOption && !isSelectedOption) {
                      // Correct answer that wasn't selected
                      optionStyle = 'bg-green-50 border-green-300 text-green-800';
                      iconElement = (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      );
                    } else if (!isCorrectOption && isSelectedOption) {
                      // Wrong answer that was selected
                      optionStyle = 'bg-red-50 border-red-300 text-red-800';
                      iconElement = (
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      );
                    }

                    return (
                      <div 
                        key={optIndex} 
                        className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200 ${optionStyle}`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                          isCorrectOption 
                            ? 'border-green-500 bg-green-500 text-white' 
                            : isSelectedOption
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-gray-300 bg-white text-gray-500'
                        }`}>
                          {letters[optIndex]}
                        </div>
                        <span className="flex-1 font-medium">
                          {opt}
                        </span>
                        {iconElement && (
                          <div className="flex-shrink-0">
                            {iconElement}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!isCorrect && (
                  <div className="ml-12 mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Correct answer:</span> {letters[correct]} - {q.options[correct]}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-sm p-6 mt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                Back to Dashboard
              </Button>
            </Link>
            <Link to={`/quiz/${attempt.quiz?._id || attempt.quizId}`} className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReviewQuiz;