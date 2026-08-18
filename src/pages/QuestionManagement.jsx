import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function QuestionManagement() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [quizId, setQuizId] = useState("");
const [questionText, setQuestionText] = useState("");
const [marks, setMarks] = useState(1);
const [explanation, setExplanation] = useState("");
const [difficulty, setDifficulty] = useState("EASY");

const [options, setOptions] = useState([
  { option_text: "", is_correct: true },
  { option_text: "", is_correct: false },
  { option_text: "", is_correct: false },
  { option_text: "", is_correct: false },
]);



  const token = localStorage.getItem("token");

  const fetchQuizzes = async () => {
    const response = await fetch(
      "http://localhost:5000/api/admin/quizzes",
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
  };

  const fetchQuestions = async () => {
    const response = await fetch(
      "http://localhost:5000/api/admin/questions",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to fetch questions");
    }

    setQuestions(data.questions || []);
  };

const handleOptionTextChange = (index, value) => {
  const updatedOptions = [...options];

  updatedOptions[index] = {
    ...updatedOptions[index],
    option_text: value,
  };

  setOptions(updatedOptions);
};

const handleCorrectOptionChange = (correctIndex) => {
  const updatedOptions = options.map((option, index) => ({
    ...option,
    is_correct: index === correctIndex,
  }));

  setOptions(updatedOptions);
};

const resetForm = () => {
  setQuizId("");
  setQuestionText("");
  setMarks(1);
  setExplanation("");
  setDifficulty("EASY");

  setOptions([
    { option_text: "", is_correct: true },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
  ]);

  setEditingId(null);
};

const handleSubmit = async (event) => {
  event.preventDefault();

  setMessage("");
  setError("");

  try {
    const url = editingId
      ? `http://localhost:5000/api/admin/questions/${editingId}`
      : "http://localhost:5000/api/admin/questions";

    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        quiz_id: Number(quizId),
        question_text: questionText,
        marks: Number(marks),
        explanation,
        difficulty,
        options,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to save question");
    }

    setMessage(data.message);
    resetForm();
    await fetchQuestions();
  } catch (error) {
    setError(error.message);
  }
};

const handleEdit = (question) => {
  setEditingId(question.id);
  setQuizId(String(question.quiz_id));
  setQuestionText(question.question_text);
  setMarks(question.marks);
  setExplanation(question.explanation || "");
  setDifficulty(question.difficulty);

  setOptions(
    question.options.map((option) => ({
      option_text: option.option_text,
      is_correct: option.is_correct,
    }))
  );

  setMessage("");
  setError("");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleDelete = async (questionId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this question?"
  );

  if (!confirmed) {
    return;
  }

  setMessage("");
  setError("");

  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/questions/${questionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to delete question");
    }

    if (editingId === questionId) {
      resetForm();
    }

    setMessage(data.message);
    await fetchQuestions();
  } catch (error) {
    setError(error.message);
  }
};

  useEffect(() => {
    const loadPage = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        await Promise.all([fetchQuizzes(), fetchQuestions()]);
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
      }
    };

    loadPage();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-5 rounded bg-slate-700 px-4 py-2 text-white"
        >
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-slate-900">
          Question Management
        </h1>

        <p className="mt-2 text-slate-600">
          Create and manage quiz questions and answer options.
        </p>

        {message && (
          <div className="mt-5 rounded bg-green-100 p-3 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

<form
  onSubmit={handleSubmit}
  className="mt-8 rounded-lg bg-white p-6 shadow"
>
  <h2 className="text-xl font-bold">
    {editingId ? "Edit Question" : "Add New Question"}
  </h2>

  <div className="mt-5">
    <label className="mb-2 block font-medium">
      Select Quiz
    </label>

    <select
      value={quizId}
      onChange={(event) => setQuizId(event.target.value)}
      required
      className="w-full rounded border border-slate-300 p-3"
    >
      <option value="">Choose a quiz</option>

      {quizzes.map((quiz) => (
        <option key={quiz.id} value={quiz.id}>
          {quiz.title}
        </option>
      ))}
    </select>
  </div>

  <div className="mt-5">
    <label className="mb-2 block font-medium">
      Question
    </label>

    <textarea
      value={questionText}
      onChange={(event) => setQuestionText(event.target.value)}
      required
      rows="3"
      placeholder="Enter the question"
      className="w-full rounded border border-slate-300 p-3"
    />
  </div>

  <div className="mt-5 grid gap-5 md:grid-cols-2">
    <div>
      <label className="mb-2 block font-medium">
        Marks
      </label>

      <input
        type="number"
        value={marks}
        onChange={(event) => setMarks(event.target.value)}
        required
        min="1"
        className="w-full rounded border border-slate-300 p-3"
      />
    </div>

    <div>
      <label className="mb-2 block font-medium">
        Difficulty
      </label>

      <select
        value={difficulty}
        onChange={(event) => setDifficulty(event.target.value)}
        className="w-full rounded border border-slate-300 p-3"
      >
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
    </div>
  </div>

  <div className="mt-5">
    <label className="mb-2 block font-medium">
      Explanation
    </label>

    <textarea
      value={explanation}
      onChange={(event) => setExplanation(event.target.value)}
      rows="2"
      placeholder="Explain why the answer is correct"
      className="w-full rounded border border-slate-300 p-3"
    />
  </div>

  <div className="mt-6">
    <h3 className="font-semibold">Answer Options</h3>

    <p className="mt-1 text-sm text-slate-500">
      Enter the answers and select the correct one.
    </p>

    <div className="mt-4 space-y-3">
      {options.map((option, index) => (
        <div
          key={index}
          className="flex items-center gap-3"
        >
          <input
            type="radio"
            name="correctOption"
            checked={option.is_correct}
            onChange={() => handleCorrectOptionChange(index)}
            title="Select correct answer"
          />

          <input
            type="text"
            value={option.option_text}
            onChange={(event) =>
              handleOptionTextChange(index, event.target.value)
            }
            required
            placeholder={`Option ${index + 1}`}
            className="w-full rounded border border-slate-300 p-3"
          />
        </div>
      ))}
    </div>
  </div>

  <div className="mt-6 flex gap-3">
    <button
      type="submit"
      className="rounded bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
    >
      {editingId ? "Update Question" : "Create Question"}
    </button>

    {editingId && (
      <button
        type="button"
        onClick={resetForm}
        className="rounded bg-slate-500 px-5 py-3 text-white"
      >
        Cancel Edit
      </button>
    )}
  </div>
</form>

        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Available quizzes</h2>

          {quizzes.length === 0 ? (
            <p className="mt-4 text-slate-500">
              No quizzes are available. Create a quiz first.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {quizzes.map((quiz) => (
                <li
                  key={quiz.id}
                  className="rounded border border-slate-200 p-3"
                >
                  {quiz.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Existing questions</h2>

          {questions.length === 0 ? (
            <p className="mt-4 text-slate-500">
              No questions have been created yet.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="rounded border border-slate-200 p-4"
                >
                  <p className="font-semibold">
                    {question.question_text}
                  </p>

                  <p className="text-sm text-slate-500">
                    Quiz: {question.quiz_title}
                  </p>

                  <ul className="mt-3 list-inside list-disc">
                    {question.options.map((option) => (
                      <li
                        key={option.id}
                        className={
                          option.is_correct
                            ? "font-semibold text-green-600"
                            : "text-slate-700"
                        }
                      >
                        {option.option_text}
                        {option.is_correct && " — Correct answer"}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex gap-3">
  <button
    type="button"
    onClick={() => handleEdit(question)}
    className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => handleDelete(question.id)}
    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
  >
    Delete
  </button>
</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionManagement;