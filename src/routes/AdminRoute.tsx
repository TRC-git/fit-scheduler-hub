
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { useEffect } from "react";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading, user, refreshAdminStatus } = useAuth();
  const { toast } = useToast();

  // Check admin status on mount if needed
  useEffect(() => {
    // Only refresh if user exists and isAdmin is null
    if (user && isAdmin === null) {
      refreshAdminStatus();
    }
  }, [user, isAdmin, refreshAdminStatus]);

  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (isAdmin === false) {
    toast({
      title: "Access Denied",
      description: "You need admin privileges to access this page",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return isAdmin ? <>{children}</> : null;
};

export default AdminRoute;
