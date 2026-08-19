import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch users");
      }

      setUsers(data.users || []);
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (user) => {
    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${user.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update user");
      }

      setUsers((current) =>
        current.map((item) => (item.id === user.id ? data.user : item))
      );
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <AdminSidebar active="User Management" />
      <main className="min-w-0 flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
        <p className="mt-2 text-slate-600">
          View students and activate or deactivate their accounts.
        </p>

        {error && <div className="mt-6 rounded bg-red-100 p-4 text-red-700">{error}</div>}

        <section className="mt-8 overflow-hidden rounded-xl bg-white shadow">
          {loading ? (
            <p className="p-8">Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-white">
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
                    <tr key={user.id} className="border-b border-slate-200">
                      <td className="p-4 font-medium">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.role}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-3 py-1 text-sm ${user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {user.role === "STUDENT" ? (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(user)}
                            className={`rounded px-4 py-2 text-sm text-white ${user.status === "ACTIVE" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
                          >
                            {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
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
          )}
        </section>
      </main>
    </div>
  );
}

export default UserManagement;