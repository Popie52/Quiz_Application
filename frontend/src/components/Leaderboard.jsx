
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const Leaderboard = () => {
  const { quizId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get(`/leaderboard/${quizId}`);
        setLeaderboard(res.data);
      } catch (err) {
        console.error("Failed to load leaderboard", err);
        setError("Could not fetch leaderboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [quizId]);

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  const getRankBadgeStyle = (rank) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    if (rank === 3) return "bg-gradient-to-r from-orange-300 to-orange-600 text-white";
    return "bg-slate-100 text-slate-700";
  };

  const getScorePercentage = (score, total) => {
    return Math.round((score / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded-lg w-48 mx-auto animate-pulse"></div>
            <div className="h-3 bg-slate-200 rounded-lg w-32 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Quiz Leaderboard</h1>
          <p className="text-slate-600 max-w-md mx-auto">
            See how you rank against other participants in this challenge
          </p>
        </div>

        {/* Content */}
        {error ? (
          <div className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Unable to load leaderboard</h3>
              <p className="text-sm text-slate-600">{error}</p>
            </div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No attempts yet</h3>
              <p className="text-sm text-slate-600">Be the first to take this quiz and claim the top spot!</p>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
            {/* Leaderboard Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
              <div className="flex items-center justify-between text-white">
                <h2 className="text-xl font-bold">Top Performers</h2>
                <div className="text-sm opacity-90">
                  {leaderboard.length} participant{leaderboard.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            {/* Leaderboard List */}
            <div className="p-6">
              <div className="space-y-4">
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const percentage = getScorePercentage(entry.score, entry.totalQuestions);
                  
                  return (
                    <div
                      key={index}
                      className={`relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg ${
                        rank <= 3 
                          ? 'bg-gradient-to-r from-white to-slate-50 border-slate-200 shadow-md' 
                          : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between p-6">
                        {/* Left Section - Rank & User */}
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${getRankBadgeStyle(rank)}`}>
                            {typeof getRankIcon(rank) === 'string' ? (
                              <span className="text-2xl">{getRankIcon(rank)}</span>
                            ) : (
                              getRankIcon(rank)
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-lg">
                              {entry.username}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {new Date(entry.attemptedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Right Section - Score */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">
                            {entry.score}<span className="text-slate-500">/{entry.totalQuestions}</span>
                          </div>
                          <div className="text-sm text-slate-600">
                            {percentage}% accuracy
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="px-6 pb-4">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              percentage >= 90 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                              percentage >= 70 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                              percentage >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              'bg-gradient-to-r from-red-400 to-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Rank Badge for Top 3 */}
                      {rank <= 3 && (
                        <div className="absolute top-2 right-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                            rank === 2 ? 'bg-gray-400 text-gray-900' :
                            'bg-orange-400 text-orange-900'
                          }`}>
                            #{rank}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Stats */}
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
              <div className="flex justify-between items-center text-sm text-slate-600">
                <span>Updated just now</span>
                <span>
                  Average Score: {' '}
                  <span className="font-medium text-slate-900">
                    {leaderboard.length > 0 ? 
                      Math.round(leaderboard.reduce((sum, entry) => sum + entry.score, 0) / leaderboard.length * 10) / 10
                      : 'N/A'
                    }
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;