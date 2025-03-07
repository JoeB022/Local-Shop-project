import React, { createContext, useState, useContext, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap around your application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user data from localStorage and ensure it's valid
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        return Object.keys(parsedUser).length > 0 ? parsedUser : null;
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  });

  // Login function to set user data
  const login = (userData) => {
    if (!userData || Object.keys(userData).length === 0) {
      console.error("Invalid user data received for login!");
      return;
    }
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Store in localStorage
  };

  // Logout function to clear user data
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear localStorage
    console.log("User after logout:", localStorage.getItem("user")); // Debug
  };

  useEffect(() => {
    console.log("User state changed:", user); // Debugging user state changes
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
