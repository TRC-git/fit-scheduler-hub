import { useState } from "react";
import { StaffFormFields } from "./StaffFormFields";
import { PositionSelect } from "../positions/PositionSelect";
import { DialogActions } from "./DialogActions";
import { PositionWithPayRate } from "../positions/types";
import { AvailabilitySection } from "./availability/AvailabilitySection";
import { useAvailability } from "./hooks/useAvailability";
import { useStaffFormSubmit } from "./hooks/useStaffFormSubmit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface StaffDialogFormProps {
  initialData?: any;
  onSubmit: (formData: any, positions: PositionWithPayRate[]) => Promise<any>;
  onCancel: () => void;
  loading: boolean;
}

export const StaffDialogForm = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  loading: parentLoading 
}: StaffDialogFormProps) => {
  const [selectedPositions, setSelectedPositions] = useState<PositionWithPayRate[]>([]);
  const [formData, setFormData] = useState({
    firstname: initialData?.firstname || "",
    lastname: initialData?.lastname || "",
    email: initialData?.email || "",
    phonenumber: initialData?.phonenumber || "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { toast } = useToast();

  const { availability, setAvailability } = useAvailability(initialData?.employeeid);
  const { submitForm, loading } = useStaffFormSubmit(initialData, onSubmit, onCancel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!initialData && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (!initialData && password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (!initialData) {
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: password,
          email_confirm: true,
          user_metadata: {
            first_name: formData.firstname,
            last_name: formData.lastname,
          }
        });

        if (authError) {
          console.error("Auth error:", authError);
          toast({
            title: "Error",
            description: authError.message,
            variant: "destructive",
          });
          return;
        }

        console.log("Auth user created:", authData);
      } catch (error) {
        console.error("Error creating auth user:", error);
        toast({
          title: "Error",
          description: "Failed to create user account",
          variant: "destructive",
        });
        return;
      }
    }

    await submitForm(formData, selectedPositions, availability);
  };

  const handlePasswordReset = async () => {
    if (!initialData?.email) return;

    try {
      const { error } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: initialData.email,
      });

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

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePositionsChange = (positions: PositionWithPayRate[]) => {
    setSelectedPositions(positions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StaffFormFields formData={formData} onChange={handleFormChange} />
      
      {!initialData ? (
        // New staff - show password setup
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-fitness-text">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}
        </div>
      ) : (
        // Existing staff - show reset password button
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
      )}

      <PositionSelect 
        selectedPositions={selectedPositions}
        onPositionsChange={handlePositionsChange}
      />
      <AvailabilitySection 
        availability={availability}
        onChange={setAvailability}
      />
      <DialogActions 
        onCancel={onCancel}
        loading={loading || parentLoading}
        isEditing={!!initialData}
      />
    </form>
  );
};
