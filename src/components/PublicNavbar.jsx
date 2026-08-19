import { useNavigate } from "react-router-dom";

function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-white/10 bg-slate-950 text-white shadow-lg">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-xl font-bold"
        >
          Quiz<span className="text-blue-400">Platform</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 sm:px-4"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 sm:px-4"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 sm:px-4"
          >
            Register
          </button>
        </div>
      </nav>
    </header>
  );
}

export default PublicNavbar;