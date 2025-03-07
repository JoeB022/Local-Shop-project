// AuthCallback.jsx - Component to handle the callback from OAuth
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    try {
      // Get data from URL fragment
      const fragment = window.location.hash.substring(1);

      if (!fragment) {
        setError("No authentication data received");
        setIsProcessing(false);
        return;
      }

      // Parse the JSON data from the fragment
      const authData = JSON.parse(decodeURIComponent(fragment));

      if (!authData || !authData.token) {
        setError("Invalid authentication data");
        setIsProcessing(false);
        return;
      }

      login(authData);

      // Store auth data in localStorage
      localStorage.setItem("token", authData.token);
      localStorage.setItem("username", authData.username || "");
      localStorage.setItem("role", authData.role || "");

      console.log("Auth successful, redirecting to dashboard");

      // Determine where to redirect based on role
      const pages = {
        admin: "/admin",
        clerk: "/clerk",
        merchant: "/merchant",
      };

      const redirectPath = pages[authData.role] || "/dashboard";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error("Auth callback error:", err);
      setError("Failed to process authentication data");
      setIsProcessing(false);
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="auth-error">
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/login")}>Return to Login</button>
      </div>
    );
  }

  return (
    <div className="auth-processing">
      <h2>Processing Authentication</h2>
      <p>Please wait while we complete your login...</p>
    </div>
  );
}

export default AuthCallback;
