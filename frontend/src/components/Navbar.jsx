// src/components/Common/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const Navbar = () => {
  const { user, logout } = useAuth(); // Get the user and logout function from AuthContext

  return (
    <nav className="h-12 flex !px-4 items-center border-neutral-200 bg-white border-b justify-between">
      <Link to="/" className="font-bold tracking-tight text-blue-500">
        Local Shop
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="size-8 grid place-items-center text-white font-black bg-neutral-800 rounded-full">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
