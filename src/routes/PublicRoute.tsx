import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../integrations/supabase/client";

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

export default PublicRoute;
