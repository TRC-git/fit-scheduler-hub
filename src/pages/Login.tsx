
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { isLoading } = useAuth();
  const navigate = useNavigate();

  // Show a loading state while checking the session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <p className="text-foreground">Checking authentication...</p>
      </div>
    );
  }

  const handleSkipToDemo = async () => {
    try {
      // Sign in with a demo account or create a temporary session
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'demo@example.com',
        password: 'demo123456'
      });
      
      if (error) {
        console.log('Demo login failed, navigating anyway:', error);
        // If demo login fails, just navigate directly
        navigate("/");
      } else {
        // If demo login succeeds, navigation will happen automatically via auth state change
        console.log('Demo login successful');
      }
    } catch (error) {
      console.error('Error during demo login:', error);
      // Fallback: navigate directly
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-['Cousine']">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg p-8 border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center font-['Cousine'] tracking-wider tracking-wider">ScheduleFor</h1>
          <p className="text-foreground text-center mb-6 font-['Cousine'] text-sm">Sign in to your account or create a new one</p>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#15e7fb',
                    brandAccent: '#15e7fb',
                  },
                },
              },
              className: {
                container: 'auth-container font-[Cousine]',
                button: 'auth-button font-[Cousine]',
                anchor: 'auth-anchor font-[Cousine]',
                input: 'text-white font-[Cousine]',
              },
              style: {
                input: {
                  color: '#FFFFFF',
                  fontFamily: 'Cousine',
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
            view="sign_in"
          />
          
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              onClick={handleSkipToDemo}
              variant="outline"
              className="w-full bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground font-['Cousine']"
            >
              Skip to Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
