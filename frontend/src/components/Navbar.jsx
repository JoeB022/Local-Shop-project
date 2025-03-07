// src/components/Common/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const Navbar = () => {
  const { user, logout } = useAuth(); // Get the user and logout function from AuthContext

  return (
    <nav className="h-12 flex !px-4 items-center border-neutral-200 bg-white border-b justify-between">
      <span className="font-bold tracking-tight text-blue-500">Local Shop</span>

      <div className="size-8 grid place-items-center text-white font-black bg-neutral-800 rounded-full">
        {user && user.username.split("")[0].toUpperCase()}
      </div>
    </nav>
  );
};

export default Navbar;
