import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import QuizManagement from "./pages/QuizManagement";
import CategoryManagement from "./pages/CategoryManagement";
import QuestionManagement from "./pages/QuestionManagement";
import StudentQuizList from "./pages/StudentQuizList";
import QuizDetails from "./pages/QuizDetails";
import QuizAttempt from "./pages/QuizAttempt";
import QuizResult from "./pages/QuizResult";
import AttemptHistory from "./pages/AttemptHistory";
import AdminAnalytics from "./pages/AdminAnalytics";
import Leaderboard from "./pages/Leaderboard";
import Home from "./pages/Home";
import UserManagement from "./pages/UserManagement";
import AdminResults from "./pages/AdminResults";



function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route
          path="/"
          element={<Navigate to="/register" replace />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
  path="/login"
  element={<Login />}
/>
<Route
  path="/dashboard"
  element={<StudentDashboard />}
/>
<Route
  path="/admin/dashboard"
  element={<AdminDashboard />}
/>

<Route
  path="/admin/quizzes"
  element={<QuizManagement />}
/>

<Route
  path="/admin/categories"
  element={<CategoryManagement />}
/>

<Route
  path="/admin/questions"
  element={<QuestionManagement />}
/>

<Route
  path="/student/quizzes"
  element={<StudentQuizList />}
/>

<Route
  path="/student/quizzes/:id"
  element={<QuizDetails />}
/>

<Route
  path="/student/attempts/:attemptId"
  element={<QuizAttempt />}
/>

<Route
  path="/student/results/:attemptId"
  element={<QuizResult />}
/>

<Route
  path="/student/attempts"
  element={<AttemptHistory />}
/>

<Route
  path="/admin/analytics"
  element={<AdminAnalytics />}
/>

<Route
  path="/leaderboard"
  element={<Leaderboard />}
/>

<Route
  path="/admin/users"
  element={<UserManagement />}
/>

<Route
  path="/admin/results"
  element={<AdminResults />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;