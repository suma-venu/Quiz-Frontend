import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  });

  const loadCategories = async () => {
    const response = await fetch(
      "https://quiz-backend-9ihm.onrender.com/api/admin/categories",
      {
        headers: getHeaders()
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    setCategories(data.categories);
  };

  useEffect(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    if (user?.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    loadCategories().catch((error) => {
      setMessage(error.message);
    });
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = editingId
      ? `https://quiz-backend-9ihm.onrender.com/api/admin/categories/${editingId}`
      : "https://quiz-backend-9ihm.onrender.com/api/admin/categories";

    try {
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          name,
          description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(data.message);
      setName("");
      setDescription("");
      setEditingId(null);
      await loadCategories();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || "");
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Delete this category?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://quiz-backend-9ihm.onrender.com/api/admin/categories/${categoryId}`,
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
      await loadCategories();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-5 text-indigo-700 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-slate-900">
          Category Management
        </h1>

        {message && (
          <p className="my-5 rounded bg-indigo-100 p-3 text-indigo-700">
            {message}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="my-8 rounded-xl bg-white p-6 shadow"
        >
          <h2 className="mb-5 text-xl font-bold">
            {editingId ? "Edit Category" : "Create Category"}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Category name"
              required
              className="rounded border border-slate-300 p-3"
            />

            <input
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Description"
              className="rounded border border-slate-300 p-3"
            />
          </div>

          <div className="mt-5 flex gap-3">
            <button className="rounded bg-indigo-600 px-5 py-3 text-white">
              {editingId ? "Update Category" : "Create Category"}
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

        <div className="overflow-hidden rounded-xl bg-white shadow">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col justify-between gap-4 border-b p-5 md:flex-row md:items-center"
            >
              <div>
                <h3 className="font-bold text-slate-900">
                  {category.name}
                </h3>

                <p className="text-slate-600">
                  {category.description}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="rounded bg-blue-600 px-3 py-2 text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(category.id)}
                  className="rounded bg-red-600 px-3 py-2 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryManagement;