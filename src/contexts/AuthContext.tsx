
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean | null;
  refreshAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  isLoading: true,
  isAdmin: null,
  refreshAdminStatus: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Function to check admin status directly from database
  const checkAdminStatus = async (email: string): Promise<boolean> => {
    try {
      console.log("Checking admin status for:", email);
      const { data, error } = await supabase
        .from('employees')
        .select('is_admin')
        .eq('email', email)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }

      const adminStatus = !!data?.is_admin;
      console.log("Admin status result:", adminStatus);
      return adminStatus;
    } catch (error) {
      console.error("Failed to check admin status:", error);
      return false;
    }
  };

  // Public function to manually refresh admin status
  const refreshAdminStatus = async (): Promise<boolean> => {
    if (!user?.email) return false;
    
    const adminStatus = await checkAdminStatus(user.email);
    setIsAdmin(adminStatus);
    return adminStatus;
  };

  useEffect(() => {
    const setupAuth = async () => {
      try {
        setIsLoading(true);
        
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            // If session exists, check admin status
            if (session?.user?.email) {
              // Use setTimeout to avoid potential Supabase deadlock
              setTimeout(async () => {
                const adminStatus = await checkAdminStatus(session.user.email!);
                setIsAdmin(adminStatus);
              }, 0);
            } else {
              setIsAdmin(null);
            }
          }
        );

        // THEN check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status if we have a session
        if (session?.user?.email) {
          const adminStatus = await checkAdminStatus(session.user.email);
          setIsAdmin(adminStatus);
        }
        
        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth setup error:", error);
        toast({
          title: "Authentication Error",
          description: "Failed to set up authentication. Please refresh the page.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    setupAuth();
  }, [toast]);

  return (
    <AuthContext.Provider value={{ session, user, isLoading, isAdmin, refreshAdminStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
