import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [message, setMessage] = useState("Loading...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!token || savedUser?.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    const verifyAdmin = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setMessage(data.message);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    verifyAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>{message}</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;