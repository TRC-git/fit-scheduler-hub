
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  // If no session, redirect to login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If we have a session, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
