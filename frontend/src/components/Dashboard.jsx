
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
  Label,
  Input,
} from "./shadcn";

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
    destructive:
      "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
  };
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 py-1.5 text-xs",
    lg: "h-12 px-6 py-3 text-base",
  };
  return (
    <button
      {...props}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-xl bg-gray-200/70 ${className}`} />
);

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [myQuizzes, setMyQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setError("");
      setLoading(true);
      try {
        const [quizzesRes, attemptRes, myQuizzesRes] = await Promise.all([
          API.get("/quizzes"),
          API.get("/attempts/mine"),
          API.get("/quizzes/mine"),
        ]);
        setQuizzes(quizzesRes.data);
        setAttempts(attemptRes.data);
        setMyQuizzes(myQuizzesRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDelete = async (quizId) => {
    if (
      !window.confirm("Are you sure you want to permanently delete this quiz?")
    )
      return;

    setError("");
    try {
      await API.delete(`/quizzes/${quizId}`);
      setMyQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizId));
      setQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizId));
    } catch (err) {
      console.error("Failed to delete quiz:", err);
      setError("Failed to delete the quiz. Please try again.");
    }
  };

  const DashboardSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card
          key={i}
          className="border-0 shadow-sm bg-white/70 backdrop-blur-sm"
        >
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Modern Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              QuizPlatform
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm text-gray-600">
              Welcome back,{" "}
              <span className="font-medium text-gray-900">
                {user?.username || "User"}
              </span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-gray-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </Button>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-6">
        {/* Hero Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-600">
              Manage your quizzes and track your progress
            </p>
          </div>
          <Link to="/create">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Quiz
            </Button>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Your Created Quizzes */}
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-gray-900">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Your Quizzes
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {myQuizzes.length} quiz{myQuizzes.length !== 1 ? "es" : ""}{" "}
                  created
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myQuizzes.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {myQuizzes.map((quiz) => (
                      <div
                        key={quiz._id}
                        className="group flex justify-between items-center p-4 rounded-xl hover:bg-gray-50/80 transition-colors duration-200"
                      >
                        <Link
                          to={`/quiz/${quiz.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {quiz.title}
                        </Link>
                        <Button
                          onClick={() => handleDelete(quiz.id)}
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 h-8 w-8 p-0"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-500 mb-4">No quizzes created yet</p>
                    <Link to="/create">
                      <Button variant="outline" size="sm">
                        Create your first quiz
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Quizzes */}
            <Card className="lg:col-span-2 border-0 shadow-sm bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-gray-900">
                  <svg
                    className="w-5 h-5 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Available Quizzes
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {quizzes.length} quiz{quizzes.length !== 1 ? "es" : ""} ready
                  to take
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quizzes.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {quizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="group p-4 rounded-xl border border-gray-200/60 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
                      >
                        <Link to={`/quiz/${quiz.id}`} className="block">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                            {quiz.title}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            by {quiz.creator.username || "Unknown"}
                          </p>
                        </Link>
                        <div className="mt-2">
                          <Link to={`/quiz/${quiz.id}/leaderboard`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-800 px-2"
                            >
                              🏆 View Leaderboard
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <p className="text-gray-500">
                      No quizzes available at the moment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Your Past Attempts */}
            <Card className="lg:col-span-3 border-0 shadow-sm bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-gray-900">
                  <svg
                    className="w-5 h-5 mr-2 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Recent Attempts
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Your quiz performance history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attempts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {attempts.slice(0, 6).map((attempt) => {
                      const percentage = Math.round(
                        (attempt.score / attempt.total) * 100
                      );
                      const scoreColor =
                        percentage >= 80
                          ? "text-green-600 bg-green-50"
                          : percentage >= 60
                          ? "text-yellow-600 bg-yellow-50"
                          : "text-red-600 bg-red-50";

                      return (
                        <Link
                          key={attempt._id}
                          to={`/review/${attempt._id}`}
                          className="block group"
                        >
                          <div className="p-4 rounded-xl border border-gray-200/60 hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-200">
                            <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors mb-3 line-clamp-2">
                              {attempt.quiz.title}
                            </h3>
                            <div className="flex items-center justify-between">
                              <div
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${scoreColor}`}
                              >
                                {percentage}%
                              </div>
                              <div className="text-sm text-gray-500">
                                {attempt.score}/{attempt.total}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <p className="text-gray-500 mb-4">No attempts yet</p>
                    <p className="text-sm text-gray-400">
                      Start taking quizzes to see your progress here
                    </p>
                  </div>
                )}
                {attempts.length > 6 && (
                  <div className="mt-6 text-center">
                    <Button variant="outline" size="sm">
                      View All Attempts ({attempts.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
