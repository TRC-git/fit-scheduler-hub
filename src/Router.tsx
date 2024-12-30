import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./integrations/supabase/client";
import Index from "@/pages/Index";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";
import Staff from "@/pages/Staff";
import Reports from "@/pages/Reports";
import Payroll from "@/pages/Payroll";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-fitness-background" />;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: employees } = await supabase
        .from('employees')
        .select('is_admin')
        .eq('email', (await supabase.auth.getSession()).data.session?.user?.email)
        .single();

      setIsAdmin(employees?.is_admin || false);
      setLoading(false);
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-fitness-background" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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
            <AdminRoute>
              <Settings />
            </AdminRoute>
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
    </Routes>
  );
};

export default Router;
