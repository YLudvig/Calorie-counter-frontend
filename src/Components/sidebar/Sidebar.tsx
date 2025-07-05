import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { logout } from "../../Utilities/AuthUtil";
import type { User } from "../../types/AuthTypes";

type SidebarProps = {
  user: User;
  setUser: (user: User | null) => void;
};

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
    <div className="flex flex-col justify-between h-screen w-[220px] p-4 bg-white border-r border-blue-100 shadow-sm">
      <div>
        <div className="text-2xl font-bold text-blue-700 mb-6">Calcounter</div>
        <nav className="flex flex-col space-y-2">
          <Link
            to="/calcounter"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentPath === "/calcounter"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
          >
            Food diary
          </Link>
          <Link
            to="/weighttracking"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentPath === "/weighttracking"
              ? "bg-blue-100 text-blue-700"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
          >
            Weight Tracking
          </Link>
        </nav>
      </div>

      <div className="pt-4 border-t border-blue-100 mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-3 pl-1">
          <FaUserCircle size={24} className="text-blue-600" />
          <span className="truncate text-1xl">{userName}</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-blue-200 bg-white px-4 py-2 text-sm text-blue-700 font-medium shadow-sm 
          hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          Logga ut
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 
              0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
