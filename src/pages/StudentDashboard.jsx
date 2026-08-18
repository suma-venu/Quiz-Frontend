import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
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
          "http://localhost:5000/api/auth/profile",
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

export default StudentDashboard;