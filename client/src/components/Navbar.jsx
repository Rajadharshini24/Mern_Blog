import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  console.log("Navbar user:", user);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            B
          </div>
          <span className="text-lg sm:text-xl font-bold text-gray-900">
            BlogVerse
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-3">

          <Link
            to="/"
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-900"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/create"
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
              >
                ✍️ Write
              </Link>

              <Link to="/profile" title={user.name}>
                <img
                  src={`http://localhost:5000${user?.user?.profileImage}`}
                  className="w-9 h-9 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=" + user.name;
                  }}
                />
              </Link>

              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm text-red-500 border border-red-300 rounded-lg hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-3 border-t bg-white">

          <Link to="/" className="block text-gray-700">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/create" className="block text-indigo-600">
                ✍️ Write
              </Link>

              <Link to="/profile" className="block text-gray-700">
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block">
                Sign In
              </Link>

              <Link to="/register" className="block text-indigo-600">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;