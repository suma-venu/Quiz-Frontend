import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentQuizList() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/student/quizzes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch quizzes");
        }

        setQuizzes(data.quizzes || []);
      } catch (error) {
        if (
          error.message === "Invalid or expired token" ||
          error.message === "Access denied. No token provided."
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [navigate, token]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded bg-slate-700 px-4 py-2 text-white"
        >
          Back to Dashboard
        </button>

        <h1 className="mt-6 text-3xl font-bold">
          Available Quizzes
        </h1>

        <p className="mt-2 text-slate-600">
          Choose a quiz to view its details and begin.
        </p>

        {error && (
          <div className="mt-5 rounded bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-8">Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <div className="mt-8 rounded bg-white p-6 shadow">
            No published quizzes are currently available.
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="rounded-lg bg-white p-6 shadow"
              >
                <h2 className="text-xl font-bold">
                  {quiz.title}
                </h2>

                <p className="mt-2 text-slate-600">
                  {quiz.description}
                </p>

                <div className="mt-4 space-y-1 text-sm">
                  <p>Category: {quiz.category_name}</p>
                  <p>Difficulty: {quiz.difficulty}</p>
                  <p>Questions: {quiz.question_count}</p>
                  <p>Duration: {quiz.duration} minutes</p>
                  <p>Passing score: {quiz.passing_score}%</p>
                  <p>Maximum attempts: {quiz.max_attempts}</p>
                </div>

                <button
                  onClick={() =>
                    navigate(`/student/quizzes/${quiz.id}`)
                  }
                  className="mt-5 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentQuizList;