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
import Integrations from "@/pages/Integrations";
import { useToast } from "./hooks/use-toast";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Get current session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(session);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state
  if (loading) {
    return <div className="min-h-screen bg-fitness-background" />;
  }

  // If no session, redirect to login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If we have a session, render the protected content
  return <>{children}</>;
};

// Public route component for auth pages
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Check for session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(session);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state
  if (loading) {
    return <div className="min-h-screen bg-fitness-background" />;
  }

  // If we have a session for a public route, redirect to home
  if (session) {
    return <Navigate to="/" replace />;
  }

  // Otherwise render the public content (login page)
  return <>{children}</>;
};

// Admin route component (no changes needed)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const checkAdminStatus = async () => {
      try {
        // First check if the user is authenticated
        const sessionResult = await supabase.auth.getSession();
        const userEmail = sessionResult.data.session?.user?.email;
        
        if (!userEmail || !isMounted) return;

        // Then check if the user is an admin
        const { data: employees, error } = await supabase
          .from('employees')
          .select('is_admin')
          .eq('email', userEmail)
          .maybeSingle();

        if (!isMounted) return; // Check again before setting state
          
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          if (isMounted) {
            toast({
              title: "Error",
              description: "Failed to verify admin access",
              variant: "destructive",
            });
          }
        } else {
          // Check if any employee was found with admin access
          const isAdminUser = employees && employees.is_admin;
          setIsAdmin(!!isAdminUser);
          
          if (!isAdminUser && isMounted) {
            toast({
              title: "Access Denied",
              description: "You need admin privileges to access this page",
              variant: "destructive",
            });
          }
        }
        
        setLoading(false);
      } catch (error) {
        if (isMounted) {
          console.error('Error in checkAdminStatus:', error);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    checkAdminStatus();
    
    return () => {
      isMounted = false;
    };
  }, [toast]);

  if (loading) {
    return <div className="min-h-screen bg-fitness-background" />;
  }

  if (isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  return isAdmin ? <>{children}</> : null;
};

const Router = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
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
