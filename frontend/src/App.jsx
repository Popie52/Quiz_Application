import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateQuiz from "./components/CreateQuiz";
import ReviewQuiz from "./components/ReviewQuiz";
import AttemptQuiz from "./components/AttemptQuiz";
import ProtectedRoute from "./components/ProtectedRoutes";
import Leaderboard from "./components/Leaderboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:id"
        element={
          <ProtectedRoute>
            <AttemptQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review/:attemptId"
        element={
          <ProtectedRoute>
            <ReviewQuiz />
          </ProtectedRoute>
        }
      />
      <Route 
      path="/quiz/:quizId/leaderboard" 
      element={<Leaderboard />} />
    </Routes>
  );
}

export default App;
