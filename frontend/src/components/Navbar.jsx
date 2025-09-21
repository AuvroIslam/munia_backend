import { Moon, Sun, FileText, LogOut, User } from "lucide-react";
import { useState } from "react";
import { toggleDarkMode } from "../utils/darkMode";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(localStorage.theme === "dark");
  const { user, isAuthenticated, logout } = useAuth();

  const handleToggle = () => {
    toggleDarkMode();
    setIsDarkMode(localStorage.theme === "dark");
  };

  // Helper styles for active links
  const linkBase = "hover:text-red-600 dark:hover:text-red-500 transition";
  const linkActive = "text-red-600 dark:text-red-500 font-semibold";

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 shadow">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <FileText className="w-8 h-8 text-red-600 dark:text-red-500" />
        <span className="text-xl font-bold text-transparent bg-gradient-to-r from-red-600 to-red-700 bg-clip-text dark:from-red-500 dark:to-red-600">
          PDF Pulse
        </span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex space-x-8 font-medium text-gray-900 dark:text-gray-100">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : ""}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/store"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : ""}`
          }
        >
          Store
        </NavLink>

        <NavLink
          to="/ai-features"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : ""}`
          }
        >
          AI Features{" "}
          <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full">
            Premium
          </span>
        </NavLink>

        <NavLink
          to="/pricing"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : ""}`
          }
        >
          Pricing
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : ""}`
          }
        >
          Contact
        </NavLink>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleToggle}
          className="p-2 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          ) : (
            <Moon className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          )}
        </button>

        {isAuthenticated ? (
          <div className="flex items-center space-x-3">
            <NavLink
              to={"/upload-pdf"}
              className="px-4 py-2 rounded-lg cursor-pointer text-white font-semibold
            bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90
            transition"
            >
              Upload PDF
            </NavLink>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg cursor-pointer text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <NavLink
            to={"/auth"}
            className="px-4 py-2 rounded-lg cursor-pointer text-white font-semibold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 hover:opacity-90 transition"
          >
            Sign In
          </NavLink>
        )}
      </div>
    </nav>
  );
}
