// src/index.js
import React from "react";
import ReactDOM from "react-dom/client"; // Import from 'react-dom/client'
import App from "./App"; // Import your main App component
import { AuthProvider } from "./context/AuthContext"; // Import the AuthProvider
import "./App.css"; // Import your CSS file if you have one
import "bootstrap/dist/css/bootstrap.min.css";

// Create a root
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the application
root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
);
