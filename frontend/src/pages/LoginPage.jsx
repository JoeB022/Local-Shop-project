import React from "react";
import Login from "../components/Login";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Please enter your credentials to log in.
        </p>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
