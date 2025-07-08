import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  // If we have a session for a public route, redirect to home
  if (session) {
    return <Navigate to="/" replace />;
  }

  // Otherwise render the public content (login page)
  return <>{children}</>;
};

export default PublicRoute;
