import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ensure correct path

const Navbar = () => {
  const { user, logout } = useAuth(); // Get user and logout function

  console.log("Navbar Rendered");
  console.log("User Data:", user); // Debugging

  return (
    <nav className="h-12 flex px-4 items-center bg-white border-b justify-between">
      {/* Logo / Home Link */}
      <Link to="/" className="font-bold tracking-tight text-blue-500">
        Local Shop
      </Link>

      <div className="flex items-center gap-4">
        {/* Show Login/Register if user is NOT logged in */}
        {user && Object.keys(user).length > 0 ? (
          <>
            {/* User Avatar (Fallback to '?' if no username) */}
            <div 
              className="size-8 grid place-items-center text-white font-black bg-neutral-800 rounded-full"
              title={user.username || "User"}
            >
              {user.username ? user.username.charAt(0).toUpperCase() : "?"}
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
              aria-label="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
            <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;