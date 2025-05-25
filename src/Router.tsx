
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Staff from "@/pages/Staff";
import Reports from "@/pages/Reports";
import Payroll from "@/pages/Payroll";
import Integrations from "@/pages/Integrations";
import Home from "@/pages/Home";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import Testimonials from "@/pages/Testimonials";
import GetStarted from "@/pages/GetStarted";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";

const Router = () => {
  return (
    <Routes>
      {/* Marketing Pages */}
      <Route path="/home" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/testimonials" element={<Testimonials />} />
      <Route path="/get-started" element={<GetStarted />} />
      
      {/* Auth Pages */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      
      {/* App Pages */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute>
            <Staff />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll"
        element={
          <ProtectedRoute>
            <Payroll />
          </ProtectedRoute>
        }
      />
      <Route
        path="/integrations"
        element={
          <ProtectedRoute>
            <Integrations />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Router;
