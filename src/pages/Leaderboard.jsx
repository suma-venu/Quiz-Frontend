import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Leaderboard() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("overall");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const fetchOverall = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://quiz-backend-9ihm.onrender.com/api/leaderboard/overall",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch leaderboard");
      }

      setLeaderboard(data.leaderboard || []);
      setCategoryName("");
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryLeaderboard = async (categoryId) => {
    if (!categoryId) {
      setLeaderboard([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://quiz-backend-9ihm.onrender.com/api/leaderboard/category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to fetch category leaderboard"
        );
      }

      setLeaderboard(data.leaderboard || []);
      setCategoryName(data.category.name);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        const categoryResponse = await fetch(
          "https://quiz-backend-9ihm.onrender.com/api/leaderboard/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const categoryData = await categoryResponse.json();

        if (!categoryResponse.ok) {
          throw new Error(
            categoryData.message || "Unable to fetch categories"
          );
        }

        setCategories(categoryData.categories || []);
        await fetchOverall();
      } catch (fetchError) {
        setError(fetchError.message);
        setLoading(false);
      }
    };

    loadPage();
  }, []);

  const showOverall = () => {
    setMode("overall");
    setSelectedCategory("");
    fetchOverall();
  };

  const showCategory = () => {
    setMode("category");
    setLeaderboard([]);
    setCategoryName("");
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    fetchCategoryLeaderboard(categoryId);
  };

  const goBack = () => {
    navigate(
      storedUser?.role === "ADMIN"
        ? "/admin/dashboard"
        : "/dashboard"
    );
  };

  const rankLabel = (rank) => {
    if (Number(rank) === 1) return "🥇";
    if (Number(rank) === 2) return "🥈";
    if (Number(rank) === 3) return "🥉";
    return rank;
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-linear-to-r from-indigo-800 to-purple-800 text-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="mt-1 text-indigo-100">
              Rankings use each student's best score for every quiz.
            </p>
          </div>

          <button
            type="button"
            onClick={goBack}
            className="rounded bg-white/10 px-4 py-2 hover:bg-white/20"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-9">
        <div className="rounded-xl bg-white p-5 shadow">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={showOverall}
              className={`rounded px-5 py-3 font-semibold ${
                mode === "overall"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              Overall Leaderboard
            </button>

            <button
              type="button"
              onClick={showCategory}
              className={`rounded px-5 py-3 font-semibold ${
                mode === "category"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              Category Leaderboard
            </button>
          </div>

          {mode === "category" && (
            <div className="mt-5">
              <label className="mb-2 block font-medium">
                Select a category
              </label>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full rounded border border-slate-300 p-3 md:max-w-md"
              >
                <option value="">Choose category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <section className="mt-7 overflow-hidden rounded-xl bg-white shadow">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-bold">
              {mode === "overall"
                ? "Overall Rankings"
                : categoryName
                ? `${categoryName} Rankings`
                : "Category Rankings"}
            </h2>
          </div>

          {loading ? (
            <p className="p-8 text-center text-slate-500">
              Loading leaderboard...
            </p>
          ) : leaderboard.length === 0 ? (
            <p className="p-8 text-center text-slate-500">
              {mode === "category" && !selectedCategory
                ? "Select a category to view its leaderboard."
                : "No completed attempts are available for this leaderboard."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="p-4 text-center">Rank</th>
                    <th className="p-4">Student</th>
                    <th className="p-4">Average Score</th>
                    <th className="p-4">Quizzes Completed</th>
                  </tr>
                </thead>

                <tbody>
                  {leaderboard.map((student) => {
                    const currentStudent =
                      Number(student.user_id) === Number(storedUser?.id);

                    return (
                      <tr
                        key={student.user_id}
                        className={`border-b border-slate-200 ${
                          currentStudent ? "bg-indigo-50" : ""
                        }`}
                      >
                        <td className="p-4 text-center text-2xl font-bold">
                          {rankLabel(student.rank)}
                        </td>
                        <td className="p-4 font-semibold">
                          {student.name}
                          {currentStudent && (
                            <span className="ml-2 rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-700">
                              You
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-bold text-indigo-700">
                          {student.average_score}%
                        </td>
                        <td className="p-4">
                          {student.quizzes_completed}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Leaderboard;