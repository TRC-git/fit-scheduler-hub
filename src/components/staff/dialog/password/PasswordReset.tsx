import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PasswordResetProps {
  email: string;
}

export const PasswordReset = ({ email }: PasswordResetProps) => {
  const { toast } = useToast();

  const handlePasswordReset = async () => {
    if (!email) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (error) {
        console.error("Password reset error:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Password reset email sent",
      });
    } catch (error) {
      console.error("Error sending password reset:", error);
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={handlePasswordReset}
        className="w-full text-fitness-text border-fitness-accent hover:bg-fitness-accent/10"
      >
        Send Password Reset Email
      </Button>
    </div>
  );
};