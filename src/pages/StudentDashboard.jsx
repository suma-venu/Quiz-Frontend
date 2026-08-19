import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [statistics, setStatistics] = useState({
    total_attempts: 0,
    quizzes_completed: 0,
    average_score: 0,
    best_score: 0,
    passed_attempts: 0,
    failed_attempts: 0,
  });
  const [recentPerformance, setRecentPerformance] = useState([]);
  const [statisticsError, setStatisticsError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "https://quiz-backend-9ihm.onrender.com/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile");
        }

        setUser(data.user);
      } catch (fetchError) {
        setError(fetchError.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          "https://quiz-backend-9ihm.onrender.com/api/student/statistics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load dashboard statistics"
          );
        }

        setStatistics(data.statistics);
        setRecentPerformance(data.recent_performance || []);
      } catch (fetchError) {
        setStatisticsError(fetchError.message);
      }
    };

    fetchStatistics();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="mt-4 text-slate-600">
            {error || "Loading your dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white shadow">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Quiz Platform</h1>
            <p className="text-sm text-slate-300">Student Portal</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-slate-300">{user.email}</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="rounded-2xl bg-linear-to-r from-blue-700 to-indigo-700 p-8 text-white shadow-lg">
          <p className="text-blue-100">Welcome back,</p>
          <h2 className="mt-1 text-3xl font-bold">{user.name}</h2>
          <p className="mt-3 max-w-2xl text-blue-100">
            Test your knowledge, complete available quizzes, and review
            your previous performance from one place.
          </p>

          <span className="mt-5 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
            Account status: {user.status}
          </span>
        </section>

        {statisticsError && (
          <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
            {statisticsError}
          </div>
        )}

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatisticCard
            label="Total Attempts"
            value={statistics.total_attempts}
            color="blue"
          />
          <StatisticCard
            label="Quizzes Completed"
            value={statistics.quizzes_completed}
            color="purple"
          />
          <StatisticCard
            label="Average Score"
            value={`${statistics.average_score}%`}
            color="amber"
          />
          <StatisticCard
            label="Best Score"
            value={`${statistics.best_score}%`}
            color="green"
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Performance Chart
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Scores from your seven most recent attempts
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/student/attempts")}
                className="text-sm font-semibold text-blue-600"
              >
                View full history →
              </button>
            </div>

            {recentPerformance.length === 0 ? (
              <div className="mt-6 rounded bg-slate-100 p-8 text-center text-slate-500">
                Complete a quiz to see your performance chart.
              </div>
            ) : (
              <div className="mt-7 flex h-64 items-end gap-3 border-b border-l border-slate-300 px-4 pt-4">
                {recentPerformance.map((attempt) => (
                  <div
                    key={attempt.attempt_id}
                    className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                  >
                    <span className="mb-2 text-xs font-bold text-slate-700">
                      {attempt.percentage}%
                    </span>
                    <div
                      title={`${attempt.quiz_title}: ${attempt.percentage}%`}
                      className={`w-full max-w-14 rounded-t transition-all ${
                        attempt.result_status === "PASS"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        height: `${Math.max(
                          Number(attempt.percentage),
                          4
                        )}%`,
                      }}
                    />
                    <p className="mt-2 w-full truncate text-center text-xs text-slate-500">
                      {attempt.quiz_title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold text-slate-900">
              Result Summary
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Passed</span>
                  <strong>{statistics.passed_attempts}</strong>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded bg-slate-200">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: statistics.total_attempts
                        ? `${
                            (Number(statistics.passed_attempts) /
                              Number(statistics.total_attempts)) *
                            100
                          }%`
                        : "0%",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>Failed</span>
                  <strong>{statistics.failed_attempts}</strong>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded bg-slate-200">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: statistics.total_attempts
                        ? `${
                            (Number(statistics.failed_attempts) /
                              Number(statistics.total_attempts)) *
                            100
                          }%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-9">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Student Dashboard
            </h2>
            <p className="mt-1 text-slate-600">
              Select an option to continue.
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate("/student/quizzes")}
              className="group rounded-xl bg-white p-7 text-left shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl">
                📝
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Available Quizzes
              </h3>
              <p className="mt-2 text-slate-600">
                Browse published quizzes, view their details, and start a
                new attempt.
              </p>
              <p className="mt-5 font-semibold text-blue-600 group-hover:text-blue-700">
                View quizzes →
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate("/student/attempts")}
              className="group rounded-xl bg-white p-7 text-left shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-2xl">
                📊
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">
                Attempt History
              </h3>
              <p className="mt-2 text-slate-600">
                View previous scores, pass/fail results, answers, and
                explanations.
              </p>
              <p className="mt-5 font-semibold text-purple-600 group-hover:text-purple-700">
                View history →
              </p>
            </button>

            <button
  type="button"
  onClick={() => navigate("/leaderboard")}
  className="rounded-xl bg-white p-7 text-left shadow transition hover:-translate-y-1 hover:shadow-lg"
>
  <div className="text-2xl">🏆</div>
  <h3 className="mt-4 text-xl font-bold">Leaderboard</h3>
  <p className="mt-2 text-slate-600">
    View overall and category rankings.
  </p>
</button>

          </div>
        </section>

        <section className="mt-9 rounded-xl bg-white p-6 shadow">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Account Information
              </h2>
              <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-600">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Status:</strong> {user.status}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatisticCard({ label, value, color }) {
  const colors = {
    blue: "border-blue-500 bg-blue-50 text-blue-700",
    purple: "border-purple-500 bg-purple-50 text-purple-700",
    amber: "border-amber-500 bg-amber-50 text-amber-700",
    green: "border-green-500 bg-green-50 text-green-700",
  };

  return (
    <div
      className={`rounded-xl border-l-4 p-5 shadow-sm ${colors[color]}`}
    >
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

export default StudentDashboard;