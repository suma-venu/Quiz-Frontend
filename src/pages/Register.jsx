import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage(data.message);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setIsError(true);
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      <PublicNavbar />

      <div className="px-5 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-blue-700 to-indigo-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-2xl font-bold"
            >
              Quiz Platform
            </button>

            <div className="mt-24">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-200">
                Learn · Attempt · Improve
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-tight">
                Test your knowledge and track your progress.
              </h1>
              <p className="mt-5 max-w-md text-lg text-blue-100">
                Create your student account to access published quizzes,
                timed assessments, results, explanations, and rankings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-lg bg-white/10 p-3">Timed quizzes</div>
            <div className="rounded-lg bg-white/10 p-3">Instant results</div>
            <div className="rounded-lg bg-white/10 p-3">Leaderboards</div>
          </div>
        </section>

        <section className="flex items-center justify-center p-7 sm:p-12">
          <div className="w-full max-w-md">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-8 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Back to Home
            </button>

            <h1 className="text-3xl font-bold text-slate-900">
              Student Registration
            </h1>
            <p className="mt-2 text-slate-600">
              Create an account and begin your quiz journey.
            </p>

            {message && (
              <div
                className={`mt-6 rounded-lg p-4 text-sm ${
                  isError
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

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
                  placeholder="student@example.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                  minLength="6"
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Login here
              </button>
            </p>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}

export default Register;