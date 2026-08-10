import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";

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
  path="/StudentDashboard"
  element={<StudentDashboard />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;