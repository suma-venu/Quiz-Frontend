import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AttemptHistory() {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await fetch(
          "https://quiz-backend-9ihm.onrender.com/api/student/attempts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch attempt history"
          );
        }

        setAttempts(data.attempts || []);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="rounded bg-slate-700 px-4 py-2 text-white"
        >
          Back to Dashboard
        </button>

        <h1 className="mt-6 text-3xl font-bold">Attempt History</h1>
        <p className="mt-2 text-slate-600">
          View your previous quiz scores and answer reviews.
        </p>

        {error && (
          <div className="mt-5 rounded bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-8">Loading attempts...</p>
        ) : attempts.length === 0 ? (
          <div className="mt-8 rounded bg-white p-6 shadow">
            You have not completed any quizzes yet.
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-lg bg-white shadow">
            <table className="w-full text-left">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-4">Quiz</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Percentage</th>
                  <th className="p-4">Result</th>
                  <th className="p-4">Completed</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {attempts.map((attempt) => (
                  <tr
                    key={attempt.attempt_id}
                    className="border-b border-slate-200"
                  >
                    <td className="p-4 font-medium">
                      {attempt.quiz_title}
                    </td>
                    <td className="p-4">{attempt.category_name}</td>
                    <td className="p-4">{attempt.percentage}%</td>
                    <td className="p-4">
                      <span
                        className={`rounded px-3 py-1 text-sm font-semibold ${
                          attempt.result_status === "PASS"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {attempt.result_status}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(attempt.completed_at).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/student/results/${attempt.attempt_id}`
                          )
                        }
                        className="rounded bg-blue-600 px-4 py-2 text-white"
                      >
                        View Result
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttemptHistory;