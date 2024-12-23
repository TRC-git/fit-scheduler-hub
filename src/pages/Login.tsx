import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      switch (_event) {
        case 'SIGNED_UP':
          toast({
            title: "Account created successfully",
            description: "Please check your email to verify your account",
          });
          break;
        case 'USER_UPDATED':
        case 'SIGNED_IN':
          if (session) {
            navigate("/");
          }
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-fitness-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-fitness-card rounded-lg p-8">
          <h1 className="text-2xl font-bold text-fitness-text mb-2 text-center">Welcome to Fitness Schedule</h1>
          <p className="text-fitness-text text-center mb-6">Sign in to your account or create a new one</p>
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
                container: 'auth-container',
                button: 'auth-button',
                anchor: 'auth-anchor',
                input: 'text-white',
              },
              style: {
                input: {
                  color: '#FFFFFF',
                },
              },
            }}
            providers={[]}
            view="sign_up"
            localization={{
              variables: {
                sign_up: {
                  button_label: "Sign up",
                  password_label: "Create a Password",
                  email_label: "Email",
                  link_text: "Already have an account? Sign in",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;