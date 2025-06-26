import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { logout } from "../../Utilities/AuthUtil";
import type { User } from "../../types/AuthTypes";

type SidebarProps = {
  user: User;
  setUser: (user: User | null) => void;
}

export default function Sidebar({ user, setUser }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const userName = user.username;

  function handleLogout(event: React.MouseEvent) {
    event.preventDefault();
    setUser(null);
    logout();
    navigate("/");
  }

  return (
    <div className="flex flex-col justify-between h-screen p-2 w-[220px]">
      <div>
        <div className="text-2xl mb-4 font-semibold">Calcounter</div>
        <div className="flex flex-col">
          <Link
            to="/calcounter"
            className={`block mb-2 rounded px-3 py-2 no-underline ${currentPath === "/calcounter" ? "bg-blue-400 text-white" : "hover:bg-gray-100"
              }`}
          >
            Food diary
          </Link>
          {/* Statistics är ej skapad ännu */}
          <Link
            to="/statistics"
            className={`block mb-2 rounded px-3 py-2 no-underline ${currentPath === "/statistics" ? "bg-blue-400 text-white" : "hover:bg-gray-100"
              }`}
          >
            Statistics
          </Link>
          <Link
            to="/weighttracking"
            className={`block mb-2 rounded px-3 py-2 no-underline ${currentPath === "/weighttracking" ? "bg-blue-400 text-white" : "hover:bg-gray-100"
              }`}
          >
            WeightTracking
          </Link>
        </div>
      </div>

      <div className="border-t border-gray-600 pt-3">
        <div className="flex items-center gap-2 text-sm mb-2">
          <FaUserCircle size={24} />
          <h3 className="truncate">{userName}</h3>
        </div>
        <div>
          <a
            href="/"
            onClick={handleLogout}
            className="text-indigo-500 text-base hover:underline"
          >
            Logga ut
          </a>
        </div>
      </div>
    </div>
  );
}
