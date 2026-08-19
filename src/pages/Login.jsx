import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setPassword("");

      if (data.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      <PublicNavbar />

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid-cols-2">
          <section className="hidden bg-gradient-to-br from-indigo-700 to-purple-800 p-12 text-white lg:flex lg:flex-col lg:justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">
              Welcome Back
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight">
              Continue your learning and assessment journey.
            </h1>
            <p className="mt-5 text-lg leading-8 text-indigo-100">
              Students can attempt quizzes and review performance. Admins can
              manage assessments, users, analytics, and rankings.
            </p>

            <div className="mt-9 space-y-3 text-indigo-100">
              <p>✓ Secure JWT authentication</p>
              <p>✓ Role-based dashboards</p>
              <p>✓ Results and performance analytics</p>
            </div>
          </section>

          <section className="p-8 sm:p-12">
            <h1 className="text-3xl font-bold text-slate-900">
              Login to Your Account
            </h1>
            <p className="mt-2 text-slate-600">
              Enter your registered email and password.
            </p>

            {message && (
              <div className="mt-6 rounded-lg bg-red-100 p-4 text-sm text-red-700">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submitting ? "Logging In..." : "Login"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-600">
              New student?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Create an account
              </button>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;