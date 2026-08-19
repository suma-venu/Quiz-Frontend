import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-xl font-bold tracking-tight"
          >
            Quiz<span className="text-blue-400">Platform</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-lg px-4 py-2 font-semibold text-slate-200 hover:bg-white/10"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-500"
            >
              Register
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 py-24 sm:py-32">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute right-0 top-36 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-300">
                Quiz Management & Online Assessment Platform
              </span>

              <h1 className="mt-7 text-5xl font-bold leading-tight sm:text-6xl">
                Learn, compete, and improve with every quiz.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Participate in timed online assessments, receive instant
                scores, review explanations, monitor your performance, and
                compete on the leaderboard.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="rounded-lg bg-blue-600 px-7 py-4 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
                >
                  Create Student Account
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-lg border border-slate-600 px-7 py-4 font-bold text-white hover:border-slate-400 hover:bg-white/5"
                >
                  Login to Platform
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
                <div className="rounded-2xl bg-white p-6 text-slate-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-blue-600">
                        Sample Assessment
                      </p>
                      <h2 className="mt-1 text-2xl font-bold">
                        General Knowledge Quiz
                      </h2>
                    </div>
                    <div className="rounded-lg bg-red-100 px-4 py-2 font-bold text-red-700">
                      09:42
                    </div>
                  </div>

                  <div className="mt-7 h-2 overflow-hidden rounded bg-slate-200">
                    <div className="h-full w-3/5 rounded bg-blue-600" />
                  </div>

                  <p className="mt-7 text-sm font-semibold text-slate-500">
                    Question 3 of 5
                  </p>
                  <h3 className="mt-2 text-lg font-bold">
                    What is the capital of India?
                  </h3>

                  <div className="mt-5 space-y-3">
                    {["Mumbai", "New Delhi", "Kolkata", "Bengaluru"].map(
                      (option, index) => (
                        <div
                          key={option}
                          className={`rounded-lg border p-4 ${
                            index === 1
                              ? "border-blue-500 bg-blue-50 text-blue-800"
                              : "border-slate-200"
                          }`}
                        >
                          {option}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.03] px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-semibold text-blue-400">Platform Features</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Everything required for online assessments
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon="⏱️"
                title="Timed Assessments"
                description="Attempt quizzes with a live countdown timer and automatic submission."
              />
              <FeatureCard
                icon="✅"
                title="Instant Results"
                description="Receive automatic scores, percentages, and pass/fail results."
              />
              <FeatureCard
                icon="📖"
                title="Answer Review"
                description="Compare selected and correct answers with clear explanations."
              />
              <FeatureCard
                icon="📊"
                title="Performance Tracking"
                description="Monitor averages, best scores, quiz history, and progress charts."
              />
              <FeatureCard
                icon="🏆"
                title="Leaderboards"
                description="View overall rankings and category-specific student rankings."
              />
              <FeatureCard
                icon="🔐"
                title="Secure Access"
                description="JWT authentication and role-based Admin and Student authorization."
              />
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-2">
            <RoleCard
              label="For Students"
              title="Build knowledge through practice"
              items={[
                "Browse and filter available quizzes",
                "Complete timed assessments",
                "Review scores and explanations",
                "Track progress and leaderboard rank",
              ]}
              buttonText="Register as Student"
              onClick={() => navigate("/register")}
              color="blue"
            />

            <RoleCard
              label="For Administrators"
              title="Manage the complete assessment process"
              items={[
                "Manage students and account status",
                "Create categories, quizzes, and questions",
                "Publish assessments and monitor attempts",
                "View platform analytics and performance",
              ]}
              buttonText="Admin Login"
              onClick={() => navigate("/login")}
              color="purple"
            />
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-center shadow-2xl sm:p-14">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to test your knowledge?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-blue-100">
              Create your free student account and begin participating in
              online quizzes today.
            </p>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="mt-7 rounded-lg bg-white px-7 py-4 font-bold text-blue-700 hover:bg-blue-50"
            >
              Get Started
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-400">
        Quiz Management & Online Assessment Platform
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-blue-400/40">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-2 leading-7 text-slate-400">{description}</p>
    </div>
  );
}

function RoleCard({ label, title, items, buttonText, onClick, color }) {
  const blue = color === "blue";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
      <p className={blue ? "font-semibold text-blue-400" : "font-semibold text-purple-400"}>
        {label}
      </p>
      <h2 className="mt-3 text-2xl font-bold">{title}</h2>
      <ul className="mt-6 space-y-3 text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className={blue ? "text-blue-400" : "text-purple-400"}>✓</span>
            {item}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClick}
        className={`mt-8 rounded-lg px-6 py-3 font-bold text-white ${
          blue
            ? "bg-blue-600 hover:bg-blue-500"
            : "bg-purple-600 hover:bg-purple-500"
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default Home;