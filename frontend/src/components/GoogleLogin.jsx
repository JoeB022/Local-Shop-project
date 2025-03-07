import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function GoogleLoginButton() {
    const navigate = useNavigate();

    const handleLoginSuccess = async (credentialResponse) => {
        const googleToken = credentialResponse.credential;  // This is the JWT from Google



        // Send Google token to your backend to exchange for YOUR app's token
        const response = await fetch("http://localhost:5000/auth/google/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: googleToken }),
        });

        if (!response.ok) {
            console.error("Failed to verify Google login");
            return;
        }

        const data = await response.json();

        // Save your app token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        // Redirect based on role
        const pages = {
            admin: "/admin",
            clerk: "/clerk",
            merchant: "/merchant",
        };
        navigate(pages[data.user.role] || "/dashboard");
    };

    return (
        <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.error("Google Login Failed")}
        />
    );
}

export default GoogleLoginButton;
