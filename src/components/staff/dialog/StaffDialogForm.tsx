import { useState } from "react";
import { StaffBasicInfo } from "./form/StaffBasicInfo";
import { StaffPositions } from "./form/StaffPositions";
import { StaffAvailability } from "./form/StaffAvailability";
import { DialogActions } from "./DialogActions";
import { PositionWithPayRate } from "../positions/types";
import { useAvailability } from "./hooks/useAvailability";
import { useStaffFormSubmit } from "./hooks/useStaffFormSubmit";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PasswordSetup } from "./password/PasswordSetup";
import { PasswordReset } from "./password/PasswordReset";
import { StaffResponse } from "../types/staff";

interface StaffDialogFormProps {
  initialData?: any;
  onSubmit: (formData: any, positions: PositionWithPayRate[]) => Promise<StaffResponse>;
  onCancel: () => void;
  loading: boolean;
}

export const StaffDialogForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading: parentLoading
}: StaffDialogFormProps) => {
  const [selectedPositions, setSelectedPositions] = useState<PositionWithPayRate[]>(
    initialData?.employeepositions?.map((ep: any) => ({
      ...ep.positions,
      payrate: ep.payrate,
      is_primary: ep.is_primary
    })) || []
  );

  const [formData, setFormData] = useState({
    firstname: initialData?.firstname || "",
    lastname: initialData?.lastname || "",
    email: initialData?.email || "",
    phonenumber: initialData?.phonenumber || "",
    is_admin: initialData?.is_admin || false,
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { toast } = useToast();

  const { availability, setAvailability } = useAvailability(initialData?.employeeid);
  const { submitForm, loading } = useStaffFormSubmit(initialData, onSubmit, onCancel);

  const handleFormChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: password,
          options: {
            data: {
              first_name: formData.firstname,
              last_name: formData.lastname,
            }
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

    try {
      const result = await submitForm(formData, selectedPositions, availability);
      if (result) {
        console.log("Staff member saved with ID:", initialData?.employeeid || result.employeeid);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Error",
        description: "Failed to save staff member",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <StaffBasicInfo formData={formData} onChange={handleFormChange} />
      
      {!initialData ? (
        <PasswordSetup
          password={password}
          confirmPassword={confirmPassword}
          passwordError={passwordError}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
        />
      ) : (
        <PasswordReset email={initialData.email} />
      )}

      <StaffPositions
        selectedPositions={selectedPositions}
        onPositionsChange={setSelectedPositions}
      />

      <StaffAvailability
        employeeId={initialData?.employeeid}
        availability={availability}
        onAvailabilityChange={setAvailability}
      />

      <DialogActions
        onCancel={onCancel}
        loading={loading || parentLoading}
        isEditing={!!initialData}
      />
    </form>
  );
};