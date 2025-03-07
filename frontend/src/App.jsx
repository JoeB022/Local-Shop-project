import React from "react";
import {BrowserRouter as Router, Routes, Route,Navigate,} from "react-router-dom";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ClerkDashboard from "./components/ClerkDashboard";
import AdminDashboard from "./components/AdminDashboard";
import MerchantDashboard from "./components/MerchantDashboard";
import ProfileDashboard from "./components/ProfileDashboard";
import AboutPage from "./pages/AboutPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import GoogleAuthSuccess from "./components/GoogleSuccess";
import AuthCallback from "./components/AuthCallback";
import MerchantLayout from "./layouts/MerchantLayout";
import MerchantStores from "./pages/merchants/MerchantStoresPage";
import MerchantStoreDetails from "./pages/merchants/MerchantStoreDetails";

const App = () => {
  const { user } = useAuth(); // Get user authentication status
  const userRole = user?.role || null; // Ensure safe access to user role

  // Wrapper for protecting routes based on user roles
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!userRole) {
      return "";
    }
    return allowedRoles.includes(userRole) ? (
      children
    ) : (
      <Navigate to="/" replace />
    );
  };

  return (
    <Router>
      <Navbar />
      <div className="main-content">
        {" "}
        {/* Ensures proper layout */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Protected Routes */}
          <Route path="/clerk" element={<ClerkDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/merchant" element={<MerchantLayout />}>
            <Route index element={<MerchantDashboard />} />
            <Route path="/merchant/stores" element={<MerchantStores />} />
            <Route path="/merchant/stores/:storeId" element={<MerchantStoreDetails />} />
          </Route>
          {/* <Route path="/merchant" element={<MerchantDashboard />} /> */}
          <Route
            path="/profile-settings"
            element={<ProfileDashboard userRole={userRole} />}
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
