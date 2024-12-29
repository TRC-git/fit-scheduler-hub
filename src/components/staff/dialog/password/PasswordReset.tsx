import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PasswordResetProps {
  email: string;
}

export const PasswordReset = ({ email }: PasswordResetProps) => {
  const { toast } = useToast();
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setShowUpdatePassword(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!showUpdatePassword ? (
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={handlePasswordReset}
            className="w-full text-fitness-text border-fitness-accent hover:bg-fitness-accent/10"
          >
            Send Password Reset Email
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowUpdatePassword(true)}
            className="w-full text-fitness-text border-fitness-accent hover:bg-fitness-accent/10"
          >
            Update Password Directly
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-fitness-text">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-fitness-inner text-fitness-text"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-fitness-text">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-fitness-inner text-fitness-text"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowUpdatePassword(false);
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="flex-1 text-fitness-text border-fitness-accent hover:bg-fitness-accent/10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handlePasswordUpdate}
              disabled={loading}
              className="flex-1 bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};