import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [statistics, setStatistics] = useState({
    total_students: 0,
    active_students: 0,
    inactive_students: 0,
    total_admins: 0
  });

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || savedUser?.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`
        };

        const [statisticsResponse, usersResponse] = await Promise.all([
          fetch("http://localhost:5000/api/admin/statistics", { headers }),
          fetch("http://localhost:5000/api/admin/users", { headers })
        ]);

        const statisticsData = await statisticsResponse.json();
        const usersData = await usersResponse.json();

        if (!statisticsResponse.ok) {
          throw new Error(statisticsData.message);
        }

        if (!usersResponse.ok) {
          throw new Error(usersData.message);
        }

        setStatistics(statisticsData.statistics);
        setUsers(usersData.users);
      } catch (error) {
        setError(error.message);
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleStatusChange = async (user) => {
  const token = localStorage.getItem("token");

  const newStatus =
    user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/users/${user.id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    setUsers((currentUsers) =>
      currentUsers.map((currentUser) =>
        currentUser.id === user.id
          ? data.user
          : currentUser
      )
    );

    setStatistics((currentStatistics) => ({
      ...currentStatistics,
      active_students:
        newStatus === "ACTIVE"
          ? currentStatistics.active_students + 1
          : currentStatistics.active_students - 1,
      inactive_students:
        newStatus === "INACTIVE"
          ? currentStatistics.inactive_students + 1
          : currentStatistics.inactive_students - 1
    }));

    setError("");
  } catch (error) {
    setError(error.message);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const cards = [
    ["Total Students", statistics.total_students],
    ["Active Students", statistics.active_students],
    ["Inactive Students", statistics.inactive_students],
    ["Administrators", statistics.total_admins]
  ];

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <aside className="bg-slate-900 p-6 text-white md:min-h-screen md:w-64">
        <h2 className="mb-8 text-2xl font-bold">Quiz Admin</h2>

        <nav className="space-y-2">
          <a className="block rounded p-3 hover:bg-slate-700" href="#overview">
            Dashboard
          </a>

          <a className="block rounded p-3 hover:bg-slate-700" href="#users">
            User Management
          </a>

          <button
  onClick={() => navigate("/admin/quizzes")}
  className="block w-full rounded p-3 text-left hover:bg-slate-700"
>
  Quizzes
</button>

          <a className="block rounded p-3 hover:bg-slate-700" href="#">
            Questions
          </a>

          <a className="block rounded p-3 hover:bg-slate-700" href="#">
            Results
          </a>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 w-full rounded bg-red-600 px-4 py-2 hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Manage the Quiz and Assessment Platform
          </p>
        </header>

        {error && (
          <p className="mb-6 rounded bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        <section
          id="overview"
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {cards.map(([title, value]) => (
            <article
              key={title}
              className="rounded-xl bg-white p-6 shadow"
            >
              <p className="text-sm text-slate-500">{title}</p>
              <p className="mt-2 text-3xl font-bold text-indigo-700">
                {value}
              </p>
            </article>
          ))}
        </section>

        <section
          id="users"
          className="mt-10 overflow-hidden rounded-xl bg-white shadow"
        >
          <div className="border-b p-6">
            <h2 className="text-xl font-bold text-slate-900">
              User Management
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-sm text-slate-600">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

             <tbody>
  {users.map((user) => (
    <tr key={user.id} className="border-t">
      <td className="p-4">{user.name}</td>

      <td className="p-4">{user.email}</td>

      <td className="p-4">{user.role}</td>

      <td className="p-4">
        <span
          className={
            user.status === "ACTIVE"
              ? "rounded-full bg-green-100 px-3 py-1 text-green-700"
              : "rounded-full bg-red-100 px-3 py-1 text-red-700"
          }
        >
          {user.status}
        </span>
      </td>

      <td className="p-4">
        {user.role === "STUDENT" ? (
          <button
            onClick={() => handleStatusChange(user)}
            className={
              user.status === "ACTIVE"
                ? "rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                : "rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
            }
          >
            {user.status === "ACTIVE"
              ? "Deactivate"
              : "Activate"}
          </button>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;