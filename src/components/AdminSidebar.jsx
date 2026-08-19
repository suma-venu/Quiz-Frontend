import { useNavigate } from "react-router-dom";

function AdminSidebar({ active }) {
  const navigate = useNavigate();

  const links = [
    ["Dashboard", "/admin/dashboard"],
    ["User Management", "/admin/users"],
    ["Quizzes", "/admin/quizzes"],
    ["Categories", "/admin/categories"],
    ["Questions", "/admin/questions"],
    ["Analytics", "/admin/analytics"],
    ["Leaderboard", "/leaderboard"],
    ["Results", "/admin/results"],
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="bg-slate-900 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
      <h2 className="mb-8 px-3 text-2xl font-bold">
        Quiz <span className="text-blue-400">Admin</span>
      </h2>

      <nav className="space-y-2">
        {links.map(([label, path]) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate(path)}
            className={`block w-full rounded-lg px-4 py-3 text-left transition ${
              active === label
                ? "bg-blue-600 font-semibold text-white"
                : "text-slate-200 hover:bg-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-10 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold hover:bg-red-700"
      >
        Logout
      </button>
    </aside>
  );
}

export default AdminSidebar;