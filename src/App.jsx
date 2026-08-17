import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import QuizManagement from "./pages/QuizManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;