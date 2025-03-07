import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser, sendResetPasswordEmail } from "../services/api"; // Import API functions
import GoogleLoginButton from "./GoogleLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState(null); // Stores error message
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await loginUser({ email, password });

      if (response && response.role) {
        login({ email, role: response.role }); // Store user role
        navigate(`/${response.role}`); // Redirect based on role
      } else {
        setError("Invalid credentials or role mismatch");
      }
    } catch (error) {
      setError(error.message || "An error occurred during login");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await sendResetPasswordEmail({ email: resetEmail });
      if (response.success) {
        alert("Reset password email sent! Please check your inbox.");
        setIsResetting(false);
        setResetEmail("");
      } else {
        setError("Failed to send reset password email. Please try again.");
      }
    } catch (error) {
      setError(error.message || "An error occurred");
    }
  };

  
  // Function to handle Google login
  const handleGoogleLogin = () => {
    // Current URL of the frontend for the callback
    const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
    // Redirect to backend Google login route
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login?callback_url=${callbackUrl}`;
  };
  

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Display errors */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <button onClick={handleGoogleLogin}>Login using google</button>
        <button className="reset-btn" onClick={() => setIsResetting(true)}>
          Reset Password
        </button>
        {isResetting && (
          <form onSubmit={handleResetPassword} style={{ marginTop: "20px" }}>
            <input
              type="email"
              className="auth-input"
              placeholder="Enter your email to reset password"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button type="submit" className="reset-btn">
              Send Reset Link
            </button>
            <button
              type="button"
              onClick={() => setIsResetting(false)}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
