

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

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

const Input = ({ className = '', ...props }) => {
    return (
        <input 
            {...props} 
            className={`flex h-10 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${className}`}
        />
    );
};

const Textarea = ({ className = '', ...props }) => {
    return (
        <textarea 
            {...props} 
            className={`flex min-h-20 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none ${className}`}
        />
    );
};

const CreateQuiz = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
  ]);
  const [category, setCategory] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (qIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswerIndex = optionIndex;
    setQuestions(newQuestions);
  };

  const handlePublicToggle = () => {
    setIsPublic(!isPublic);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Quiz title is required");
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionText.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }
      if (questions[i].options.some((opt) => !opt.trim())) {
        setError(`All options are required for question ${i + 1}`);
        return;
      }
    }

    const payload = {
      title,
      category,
      questions,
      isPublic
    };

    try {
      console.log(payload);
      await API.post("/quizzes", payload);
      setSuccess("Quiz created successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz");
    }
  };

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
          <Link to="/">
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Button>
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-6">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Create New Quiz</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Build an engaging quiz with multiple choice questions. Add a title, category, and as many questions as you'd like.
          </p>
        </div>

        {/* Status Messages */}
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

        {success && (
          <div className="mb-8 p-4 rounded-xl bg-green-50 border border-green-200">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Details Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quiz Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quiz Title</label>
                <Input
                  type="text"
                  placeholder="Enter quiz title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Input
                  type="text"
                  placeholder="e.g., Science, History, Math..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center space-x-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={handlePublicToggle}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <div>
                  <span className="text-sm font-medium text-gray-700">Public Quiz</span>
                  <p className="text-xs text-gray-500">Make this quiz visible to all users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Questions ({questions.length})
              </h3>
              <Button 
                type="button" 
                onClick={addQuestion}
                variant="secondary"
                className="bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Question
              </Button>
            </div>

            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-sm p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Question {qIndex + 1}
                  </h4>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Question Text</label>
                    <Textarea
                      placeholder="Enter your question here..."
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                      rows={2}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Answer Options</label>
                    <div className="space-y-3">
                      {q.options.map((option, oIndex) => {
                        const isCorrect = q.correctAnswerIndex === oIndex;
                        const letters = ['A', 'B', 'C', 'D'];
                        
                        return (
                          <div key={oIndex} className="flex items-center space-x-3 group/option">
                            <label className="relative flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name={`correctOption-${qIndex}`}
                                checked={isCorrect}
                                onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                                className="sr-only peer"
                                required
                              />
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                                isCorrect 
                                  ? 'border-green-500 bg-green-500 text-white' 
                                  : 'border-gray-300 bg-white text-gray-500 group-hover/option:border-green-300'
                              }`}>
                                {letters[oIndex]}
                              </div>
                            </label>
                            <div className="flex-1">
                              <Input
                                type="text"
                                placeholder={`Option ${letters[oIndex]}`}
                                value={option}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                className={isCorrect ? 'ring-2 ring-green-200 border-green-300' : ''}
                                required
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Select the correct answer by clicking the letter
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border-0 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                type="button" 
                onClick={() => navigate("/")}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create Quiz
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateQuiz;