import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function AdminResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          "https://quiz-backend-9ihm.onrender.com/api/admin/results",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch results");
        }

        setResults(data.results || []);
      } catch (fetchError) {
        if (
          fetchError.message === "Invalid or expired token" ||
          fetchError.message === "Access denied. No token provided."
        ) {
          localStorage.clear();
          navigate("/login");
          return;
        }
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate, token]);

  const filteredResults = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return results;

    return results.filter((result) =>
      [result.student_name, result.student_email, result.quiz_title, result.category_name]
        .some((field) => field?.toLowerCase().includes(value))
    );
  }, [results, search]);

  const passed = results.filter((item) => item.result_status === "PASS").length;
  const failed = results.length - passed;

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <AdminSidebar active="Results" />
      <main className="min-w-0 flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-slate-900">Quiz Results</h1>
        <p className="mt-2 text-slate-600">
          Review all completed student quiz attempts.
        </p>

        <section className="mt-7 grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Completed Attempts" value={results.length} color="blue" />
          <SummaryCard label="Passed" value={passed} color="green" />
          <SummaryCard label="Failed" value={failed} color="red" />
        </section>

        {error && <div className="mt-6 rounded bg-red-100 p-4 text-red-700">{error}</div>}

        <div className="mt-7 rounded-xl bg-white p-5 shadow">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search student, email, quiz, or category"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 md:max-w-xl"
          />
        </div>

        <section className="mt-6 overflow-hidden rounded-xl bg-white shadow">
          {loading ? (
            <p className="p-8">Loading results...</p>
          ) : filteredResults.length === 0 ? (
            <p className="p-8 text-center text-slate-500">No completed results found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Quiz</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Correct</th>
                    <th className="p-4">Incorrect</th>
                    <th className="p-4">Result</th>
                    <th className="p-4">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result) => (
                    <tr key={result.attempt_id} className="border-b border-slate-200">
                      <td className="p-4">
                        <p className="font-semibold">{result.student_name}</p>
                        <p className="text-xs text-slate-500">{result.student_email}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{result.quiz_title}</p>
                        <p className="text-xs text-slate-500">{result.category_name}</p>
                      </td>
                      <td className="p-4 font-bold">{result.percentage}%</td>
                      <td className="p-4 text-green-700">{result.correct_answers}</td>
                      <td className="p-4 text-red-700">{result.incorrect_answers}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-3 py-1 font-semibold ${result.result_status === "PASS" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {result.result_status}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {new Date(result.completed_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ label, value, color }) {
  const colors = {
    blue: "border-blue-500 text-blue-700",
    green: "border-green-500 text-green-700",
    red: "border-red-500 text-red-700",
  };
  return (
    <div className={`rounded-xl border-l-4 bg-white p-5 shadow ${colors[color]}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

export default AdminResults;