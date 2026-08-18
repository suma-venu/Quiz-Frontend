import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function QuizAttempt() {
  const navigate = useNavigate();
  const { attemptId } = useParams();

  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [timeOver, setTimeOver] = useState(false);

  useEffect(() => {
    const storedQuiz = sessionStorage.getItem("activeQuiz");

    if (!storedQuiz) {
      navigate("/student/quizzes");
      return;
    }

    const parsedQuiz = JSON.parse(storedQuiz);

    if (String(parsedQuiz.attempt.id) !== String(attemptId)) {
      navigate("/student/quizzes");
      return;
    }

    setQuizData(parsedQuiz);

    const storedAnswers = sessionStorage.getItem(
      `quizAnswers_${attemptId}`
    );

    if (storedAnswers) {
      setSelectedAnswers(JSON.parse(storedAnswers));
    }

    const endTime = new Date(
  parsedQuiz.attempt.expires_at
).getTime();

    const updateTimer = () => {
      const secondsLeft = Math.max(
        0,
        Math.floor((endTime - Date.now()) / 1000)
      );

      setRemainingSeconds(secondsLeft);

      if (secondsLeft === 0) {
        setTimeOver(true);
      }
    };

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [attemptId, navigate]);

  const handleAnswerSelection = (questionId, optionId) => {
    if (timeOver) {
      return;
    }

    const updatedAnswers = {
      ...selectedAnswers,
      [questionId]: optionId,
    };

    setSelectedAnswers(updatedAnswers);

    sessionStorage.setItem(
      `quizAnswers_${attemptId}`,
      JSON.stringify(updatedAnswers)
    );
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  if (!quizData) {
    return <p className="p-8">Loading quiz...</p>;
  }

  const questions = quizData.questions;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-5 shadow">
          <div>
            <h1 className="text-2xl font-bold">
              {quizData.quiz.title}
            </h1>

            <p className="text-slate-500">
              Question {currentQuestionIndex + 1} of{" "}
              {questions.length}
            </p>
          </div>

          <div
            className={`rounded px-5 py-3 text-xl font-bold ${
              remainingSeconds <= 60
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            Time: {formatTime(remainingSeconds)}
          </div>
        </div>

        {timeOver && (
          <div className="mt-5 rounded bg-red-100 p-4 font-semibold text-red-700">
            Time is over. Answer selection has been disabled.
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_250px]">
          <div className="rounded-lg bg-white p-7 shadow">
            <p className="text-sm font-medium text-slate-500">
              Difficulty: {currentQuestion.difficulty} · Marks:{" "}
              {currentQuestion.marks}
            </p>

            <h2 className="mt-3 text-xl font-bold">
              {currentQuestion.question_text}
            </h2>

            <div className="mt-6 space-y-3">
              {currentQuestion.options.map((option) => {
                const selected =
                  selectedAnswers[currentQuestion.id] === option.id;

                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-3 rounded border p-4 ${
                      selected
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-300"
                    } ${
                      timeOver
                        ? "cursor-not-allowed opacity-60"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={selected}
                      disabled={timeOver}
                      onChange={() =>
                        handleAnswerSelection(
                          currentQuestion.id,
                          option.id
                        )
                      }
                    />

                    <span>{option.option_text}</span>
                  </label>
                );
              })}
            </div>

            <div className="mt-7 flex justify-between">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() =>
                  setCurrentQuestionIndex(
                    currentQuestionIndex - 1
                  )
                }
                className="rounded bg-slate-600 px-5 py-2 text-white disabled:bg-slate-300"
              >
                Previous
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentQuestionIndex(
                      currentQuestionIndex + 1
                    )
                  }
                  className="rounded bg-blue-600 px-5 py-2 text-white"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  className="rounded bg-green-600 px-5 py-2 text-white"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-white p-5 shadow">
            <h2 className="font-bold">Question Navigation</h2>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {questions.map((question, index) => {
                const answered =
                  selectedAnswers[question.id] !== undefined;

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`rounded p-2 text-sm font-medium ${
                      index === currentQuestionIndex
                        ? "bg-blue-600 text-white"
                        : answered
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <p>
                Answered:{" "}
                {Object.keys(selectedAnswers).length}
              </p>

              <p>
                Unanswered:{" "}
                {questions.length -
                  Object.keys(selectedAnswers).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizAttempt;