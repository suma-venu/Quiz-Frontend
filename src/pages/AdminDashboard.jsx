import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function AdminDashboard() {
  const navigate = useNavigate();

  const [statistics, setStatistics] = useState({
    total_students: 0,
    active_students: 0,
    inactive_students: 0,
    total_admins: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || savedUser?.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    const loadStatistics = async () => {
      try {
        const response = await fetch(
          "https://quiz-backend-9ihm.onrender.com/api/admin/statistics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load dashboard");
        }

        setStatistics(data.statistics);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [navigate]);

  const cards = [
    ["Total Students", statistics.total_students, "blue"],
    ["Active Students", statistics.active_students, "green"],
    ["Inactive Students", statistics.inactive_students, "red"],
    ["Administrators", statistics.total_admins, "purple"],
  ];

  const quickActions = [
    ["Manage Students", "/admin/users", "👥"],
    ["Manage Quizzes", "/admin/quizzes", "📝"],
    ["Manage Questions", "/admin/questions", "❓"],
    ["View Analytics", "/admin/analytics", "📊"],
    ["View Results", "/admin/results", "✅"],
    ["View Leaderboard", "/leaderboard", "🏆"],
  ];

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <AdminSidebar active="Dashboard" />

      <main className="min-w-0 flex-1 p-6 md:p-10">
        <header className="mb-8">
          <p className="font-semibold text-blue-600">Administration</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-slate-600">
            Manage the Quiz and Online Assessment Platform.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(([title, value, color]) => (
              <StatisticCard
                key={title}
                title={title}
                value={value}
                color={color}
              />
            ))}
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Quick Actions
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {quickActions.map(([label, path, icon]) => (
              <button
                key={label}
                type="button"
                onClick={() => navigate(path)}
                className="rounded-xl bg-white p-6 text-left shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-3xl">{icon}</span>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {label}
                </h3>
                <p className="mt-2 text-sm font-semibold text-blue-600">
                  Open →
                </p>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatisticCard({ title, value, color }) {
  const colors = {
    blue: "border-blue-500 text-blue-700",
    green: "border-green-500 text-green-700",
    red: "border-red-500 text-red-700",
    purple: "border-purple-500 text-purple-700",
  };

  return (
    <article className={`rounded-xl border-l-4 bg-white p-6 shadow ${colors[color]}`}>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </article>
  );
}

export default AdminDashboard;