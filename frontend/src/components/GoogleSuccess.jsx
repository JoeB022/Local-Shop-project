import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function GoogleAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role");

    console.log(token)

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Immediately redirect after storing
      const pages = {
        admin: "/admin",
        clerk: "/clerk",
        merchant: "/merchant",
      };
      navigate(pages[role])
      // navigate(pages[role] || "/dashboard", { replace: true });
    } else {
      // navigate("/login");
    }
  }, []);

  return <p>Processing Google Login...</p>;
}

export default GoogleAuthSuccess;
