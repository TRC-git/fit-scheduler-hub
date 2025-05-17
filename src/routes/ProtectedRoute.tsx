
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../integrations/supabase/client";

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

export default ProtectedRoute;
