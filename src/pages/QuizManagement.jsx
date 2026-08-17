import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const emptyForm = {
  title: "",
  description: "",
  category_id: "",
  difficulty: "EASY",
  duration: "",
  passing_score: "",
  max_attempts: 1
};

function QuizManagement() {
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const loadQuizzes = async () => {
    const response = await fetch(
      "http://localhost:5000/api/admin/quizzes",
      {
        headers: getHeaders()
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    setQuizzes(data.quizzes);
  };

  useEffect(() => {
    const savedUser = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (savedUser?.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    const loadInitialData = async () => {
      try {
        const categoriesResponse = await fetch(
          "http://localhost:5000/api/admin/categories",
          {
            headers: getHeaders()
          }
        );

        const categoriesData = await categoriesResponse.json();

        if (!categoriesResponse.ok) {
          throw new Error(categoriesData.message);
        }

        setCategories(categoriesData.categories);
        await loadQuizzes();
      } catch (error) {
        setMessage(error.message);
      }
    };

    loadInitialData();
  }, [navigate]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = editingId
      ? `http://localhost:5000/api/admin/quizzes/${editingId}`
      : "http://localhost:5000/api/admin/quizzes";

    try {
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          ...form,
          category_id: Number(form.category_id),
          duration: Number(form.duration),
          passing_score: Number(form.passing_score),
          max_attempts: Number(form.max_attempts)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(data.message);
      setForm(emptyForm);
      setEditingId(null);
      await loadQuizzes();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEdit = (quiz) => {
    setEditingId(quiz.id);

    setForm({
      title: quiz.title,
      description: quiz.description || "",
      category_id: quiz.category_id,
      difficulty: quiz.difficulty,
      duration: quiz.duration,
      passing_score: quiz.passing_score,
      max_attempts: quiz.max_attempts
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (quizId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/quizzes/${quizId}`,
        {
          method: "DELETE",
          headers: getHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(data.message);
      await loadQuizzes();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleStatus = async (quizId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/quizzes/${quizId}/status`,
        {
          method: "PATCH",
          headers: getHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(data.message);
      await loadQuizzes();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-5 text-indigo-700 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-slate-900">
          Quiz Management
        </h1>

        {message && (
          <p className="my-5 rounded bg-indigo-100 p-3 text-indigo-700">
            {message}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="my-8 grid gap-5 rounded-xl bg-white p-6 shadow md:grid-cols-2"
        >
          <h2 className="text-xl font-bold md:col-span-2">
            {editingId ? "Edit Quiz" : "Create Quiz"}
          </h2>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Quiz title"
            required
            className="rounded border border-slate-300 p-3"
          />

          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
            className="rounded border border-slate-300 p-3"
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="rounded border border-slate-300 p-3 md:col-span-2"
          />

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="rounded border border-slate-300 p-3"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <input
            name="duration"
            type="number"
            min="1"
            value={form.duration}
            onChange={handleChange}
            placeholder="Duration in minutes"
            required
            className="rounded border border-slate-300 p-3"
          />

          <input
            name="passing_score"
            type="number"
            min="0"
            max="100"
            value={form.passing_score}
            onChange={handleChange}
            placeholder="Passing score percentage"
            required
            className="rounded border border-slate-300 p-3"
          />

          <input
            name="max_attempts"
            type="number"
            min="1"
            value={form.max_attempts}
            onChange={handleChange}
            placeholder="Maximum attempts"
            required
            className="rounded border border-slate-300 p-3"
          />

          <div className="flex gap-3 md:col-span-2">
            <button
              type="submit"
              className="rounded bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700"
            >
              {editingId ? "Update Quiz" : "Create Quiz"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded bg-slate-500 px-5 py-3 text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="border-t">
                  <td className="p-4 font-medium">{quiz.title}</td>
                  <td className="p-4">{quiz.category_name}</td>
                  <td className="p-4">{quiz.difficulty}</td>
                  <td className="p-4">{quiz.duration} minutes</td>
                  <td className="p-4">{quiz.status}</td>

                  <td className="flex flex-wrap gap-2 p-4">
                    <button
                      onClick={() => handleEdit(quiz)}
                      className="rounded bg-blue-600 px-3 py-2 text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleStatus(quiz.id)}
                      className="rounded bg-amber-500 px-3 py-2 text-white"
                    >
                      {quiz.status === "PUBLISHED"
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="rounded bg-red-600 px-3 py-2 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {quizzes.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-slate-500"
                  >
                    No quizzes created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default QuizManagement;