import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function QuizResult() {
  const navigate = useNavigate();
  const { attemptId } = useParams();

  const [result, setResult] = useState(null);
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(
          `https://quiz-backend-9ihm.onrender.com/api/student/attempts/${attemptId}/result`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch result");
        }

        setResult(data.result);
        setReview(data.review || []);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId, token]);

  if (loading) {
    return <p className="p-8">Loading result...</p>;
  }

  if (!result) {
    return (
      <div className="p-8 text-red-600">
        {error || "Result not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-lg bg-white p-7 shadow">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Quiz Result</h1>
              <p className="mt-2 text-xl text-slate-600">
                {result.quiz_title}
              </p>
            </div>

            <div
              className={`rounded px-6 py-3 text-2xl font-bold ${
                result.result_status === "PASS"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {result.result_status}
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ResultBox
              label="Score"
              value={`${result.score} / ${result.total_marks}`}
            />
            <ResultBox
              label="Percentage"
              value={`${result.percentage}%`}
            />
            <ResultBox
              label="Correct Answers"
              value={result.correct_answers}
            />
            <ResultBox
              label="Incorrect Answers"
              value={result.incorrect_answers}
            />
            <ResultBox
              label="Unanswered"
              value={result.unanswered}
            />
            <ResultBox
              label="Time Taken"
              value={`${result.time_taken} seconds`}
            />
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/student/attempts")}
              className="rounded bg-blue-600 px-5 py-3 text-white"
            >
              Attempt History
            </button>

            <button
              type="button"
              onClick={() => navigate("/student/quizzes")}
              className="rounded bg-slate-700 px-5 py-3 text-white"
            >
              Back to Quizzes
            </button>
          </div>
        </div>

        <h2 className="mt-9 text-2xl font-bold">Answer Review</h2>

        <div className="mt-5 space-y-5">
          {review.map((item, index) => (
            <div
              key={item.question_id}
              className="rounded-lg bg-white p-6 shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold">
                  {index + 1}. {item.question_text}
                </h3>

                <span
                  className={`rounded px-3 py-1 text-sm font-semibold ${
                    item.is_correct === true
                      ? "bg-green-100 text-green-700"
                      : item.selected_option_id === null
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.is_correct === true
                    ? "Correct"
                    : item.selected_option_id === null
                    ? "Unanswered"
                    : "Incorrect"}
                </span>
              </div>

              <p className="mt-4">
                <strong>Your answer:</strong>{" "}
                <span
                  className={
                    item.is_correct === true
                      ? "text-green-700"
                      : "text-red-700"
                  }
                >
                  {item.selected_option_text || "Not answered"}
                </span>
              </p>

              <p className="mt-2 text-green-700">
                <strong>Correct answer:</strong>{" "}
                {item.correct_option_text}
              </p>

              <div className="mt-4 rounded bg-blue-50 p-4 text-blue-900">
                <strong>Explanation:</strong>{" "}
                {item.explanation || "No explanation was provided."}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultBox({ label, value }) {
  return (
    <div className="rounded bg-slate-100 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

export default QuizResult;