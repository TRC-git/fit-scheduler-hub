
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { useToast } from "../hooks/use-toast";

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

export default AdminRoute;
