import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function QuizDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await fetch(
          `https://quiz-backend-9ihm.onrender.com/api/student/quizzes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch quiz details");
        }

        setQuiz(data.quiz);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id, token]);

  const handleStartQuiz = async () => {
    setStarting(true);
    setError("");

    try {
      const response = await fetch(
        `https://quiz-backend-9ihm.onrender.com/api/student/quizzes/${id}/start`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to start quiz");
      }

      sessionStorage.setItem("activeQuiz", JSON.stringify(data));

      navigate(`/student/attempts/${data.attempt.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return <p className="p-8">Loading quiz details...</p>;
  }

  if (!quiz) {
    return (
      <div className="p-8">
        <p className="text-red-600">
          {error || "Quiz not found"}
        </p>
      </div>
    );
  }

  const attemptsRemaining =
    Number(quiz.max_attempts) - Number(quiz.attempt_count);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate("/student/quizzes")}
          className="rounded bg-slate-700 px-4 py-2 text-white"
        >
          Back to Quizzes
        </button>

        <div className="mt-6 rounded-lg bg-white p-8 shadow">
          <h1 className="text-3xl font-bold">{quiz.title}</h1>

          <p className="mt-4 text-slate-600">
            {quiz.description}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <p><strong>Category:</strong> {quiz.category_name}</p>
            <p><strong>Difficulty:</strong> {quiz.difficulty}</p>
            <p><strong>Questions:</strong> {quiz.question_count}</p>
            <p><strong>Duration:</strong> {quiz.duration} minutes</p>
            <p><strong>Passing score:</strong> {quiz.passing_score}%</p>
            <p>
              <strong>Attempts:</strong>{" "}
              {quiz.attempt_count} / {quiz.max_attempts}
            </p>
          </div>

          <div className="mt-6 rounded bg-amber-100 p-4 text-amber-800">
            Once you start, the timer will begin. Make sure you are
            ready before continuing.
          </div>

          {error && (
            <div className="mt-5 rounded bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleStartQuiz}
            disabled={starting || attemptsRemaining <= 0}
            className="mt-6 w-full rounded bg-green-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {attemptsRemaining <= 0
              ? "Maximum Attempts Reached"
              : starting
              ? "Starting Quiz..."
              : "Start Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizDetails;