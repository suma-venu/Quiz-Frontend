import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminAnalytics() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch analytics");
        }

        setAnalytics(data);
      } catch (fetchError) {
        if (
          fetchError.message === "Invalid or expired token" ||
          fetchError.message === "Access denied. No token provided."
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate, token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-lg text-slate-600">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  const students = analytics.student_statistics;
  const quizzes = analytics.quiz_statistics;
  const attempts = analytics.attempt_statistics;
  const completed = Number(attempts.completed_attempts);
  const passed = Number(attempts.passed_attempts);
  const failed = Number(attempts.failed_attempts);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Admin Analytics</h1>
            <p className="text-sm text-slate-300">
              Platform performance and participation overview
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="rounded bg-white/10 px-4 py-2 hover:bg-white/20"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-9">
        {error && (
          <div className="mb-6 rounded bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <h2 className="text-xl font-bold text-slate-900">
          Student Statistics
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-3">
          <AnalyticsCard
            label="Total Students"
            value={students.total_students}
            color="blue"
          />
          <AnalyticsCard
            label="Active Students"
            value={students.active_students}
            color="green"
          />
          <AnalyticsCard
            label="Inactive Students"
            value={students.inactive_students}
            color="red"
          />
        </div>

        <h2 className="mt-9 text-xl font-bold text-slate-900">
          Quiz Statistics
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AnalyticsCard
            label="Total Quizzes"
            value={quizzes.total_quizzes}
            color="purple"
          />
          <AnalyticsCard
            label="Published"
            value={quizzes.published_quizzes}
            color="green"
          />
          <AnalyticsCard
            label="Unpublished"
            value={quizzes.unpublished_quizzes}
            color="amber"
          />
          <AnalyticsCard
            label="Total Questions"
            value={quizzes.total_questions}
            color="blue"
          />
        </div>

        <h2 className="mt-9 text-xl font-bold text-slate-900">
          Attempt Statistics
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AnalyticsCard
            label="Total Attempts"
            value={attempts.total_attempts}
            color="blue"
          />
          <AnalyticsCard
            label="Completed"
            value={attempts.completed_attempts}
            color="green"
          />
          <AnalyticsCard
            label="In Progress"
            value={attempts.in_progress_attempts}
            color="amber"
          />
          <AnalyticsCard
            label="Average Score"
            value={`${attempts.average_score}%`}
            color="purple"
          />
        </div>

        <section className="mt-9 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">Pass/Fail Analytics</h2>
            <p className="mt-1 text-sm text-slate-500">
              Pass rate: {attempts.pass_rate}%
            </p>

            {completed === 0 ? (
              <p className="mt-6 rounded bg-slate-100 p-6 text-center text-slate-500">
                No completed attempts yet.
              </p>
            ) : (
              <div className="mt-7 space-y-6">
                <ProgressBar
                  label="Passed"
                  count={passed}
                  percentage={(passed / completed) * 100}
                  color="bg-green-500"
                />
                <ProgressBar
                  label="Failed"
                  count={failed}
                  percentage={(failed / completed) * 100}
                  color="bg-red-500"
                />
              </div>
            )}
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">Participation</h2>
            <div className="mt-7 grid grid-cols-2 gap-5">
              <div className="rounded-lg bg-blue-50 p-5 text-center">
                <p className="text-3xl font-bold text-blue-700">
                  {attempts.participating_students}
                </p>
                <p className="mt-2 text-sm text-blue-800">
                  Participating students
                </p>
              </div>
              <div className="rounded-lg bg-indigo-50 p-5 text-center">
                <p className="text-3xl font-bold text-indigo-700">
                  {attempts.pass_rate}%
                </p>
                <p className="mt-2 text-sm text-indigo-800">
                  Overall pass rate
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-9 overflow-x-auto rounded-xl bg-white shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold">Quiz Performance</h2>
            <p className="mt-1 text-sm text-slate-500">
              Attempts and average scores for every quiz
            </p>
          </div>

          <table className="w-full text-left">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="p-4">Quiz</th>
                <th className="p-4">Category</th>
                <th className="p-4">Attempts</th>
                <th className="p-4">Average</th>
                <th className="p-4">Passed</th>
                <th className="p-4">Failed</th>
              </tr>
            </thead>
            <tbody>
              {analytics.quiz_performance.map((quiz) => (
                <tr key={quiz.quiz_id} className="border-b border-slate-200">
                  <td className="p-4 font-medium">{quiz.quiz_title}</td>
                  <td className="p-4">{quiz.category_name}</td>
                  <td className="p-4">{quiz.completed_attempts}</td>
                  <td className="p-4">{quiz.average_score}%</td>
                  <td className="p-4 text-green-700">
                    {quiz.passed_attempts}
                  </td>
                  <td className="p-4 text-red-700">
                    {quiz.failed_attempts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

function AnalyticsCard({ label, value, color }) {
  const colors = {
    blue: "border-blue-500 bg-blue-50 text-blue-700",
    green: "border-green-500 bg-green-50 text-green-700",
    red: "border-red-500 bg-red-50 text-red-700",
    amber: "border-amber-500 bg-amber-50 text-amber-700",
    purple: "border-purple-500 bg-purple-50 text-purple-700",
  };

  return (
    <div className={`rounded-xl border-l-4 p-5 shadow-sm ${colors[color]}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function ProgressBar({ label, count, percentage, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <strong>{count}</strong>
      </div>
      <div className="mt-2 h-4 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default AdminAnalytics;