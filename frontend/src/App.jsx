import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import AuthCallback from "./components/AuthCallback";
import MerchantLayout from "./layouts/MerchantLayout";
import MerchantStores from "./pages/merchants/MerchantStoresPage";
import MerchantStoreDetails from "./pages/merchants/MerchantStoreDetails";

const App = () => {
  const { user } = useAuth();
  const userRole = user?.role || null;

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!userRole) {
      return <Navigate to="/login" replace />;
    }
    return allowedRoles.includes(userRole) ? children : <Navigate to="/" replace />;
  };

  const hideNavbarFooter = ["/login", "/register", "/auth/callback"].includes(window.location.pathname);

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/about" element={<AboutPage />} />

          <Route
            path="/clerk"
            element={
              <ProtectedRoute allowedRoles={["clerk"]}>
                <ClerkDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/merchant"
            element={
              <ProtectedRoute allowedRoles={["merchant"]}>
                <MerchantLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MerchantDashboard />} />
            <Route path="stores" element={<MerchantStores />} />
            <Route path="stores/:storeId" element={<MerchantStoreDetails />} />
          </Route>

          <Route
            path="/profile-settings"
            element={
              <ProtectedRoute allowedRoles={["clerk", "admin", "merchant"]}>
                <ProfileDashboard userRole={userRole} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {!hideNavbarFooter && <Footer />}
    </>
  );
};

export default App;
