import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { StaffDialogForm } from "./dialog/StaffDialogForm";
import { Position } from "./positions/types";

interface NewStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
}

const NewStaffDialog = ({ open, onOpenChange, initialData }: NewStaffDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any, selectedPositions: Position[]) => {
    setLoading(true);
    console.log("Submitting form with positions:", selectedPositions);

    try {
      const primaryPosition = selectedPositions[0]?.positionid || null;

      if (initialData) {
        // Update existing employee
        const { error: employeeError } = await supabase
          .from("employees")
          .update({
            ...formData,
            isactive: true,
            position_id: primaryPosition,
          })
          .eq("employeeid", initialData.employeeid);

        if (employeeError) throw employeeError;

        // Delete existing positions
        const { error: deleteError } = await supabase
          .from("employeepositions")
          .delete()
          .eq("employeeid", initialData.employeeid);

        if (deleteError) throw deleteError;

        // Insert updated positions
        if (selectedPositions.length > 0) {
          const { error: positionsError } = await supabase
            .from("employeepositions")
            .insert(
              selectedPositions.map((position, index) => ({
                employeeid: initialData.employeeid,
                positionid: position.positionid,
                payrate: position.payrate || position.defaultpayrate || 0,
                is_primary: index === 0,
                access_level: position.access_level || 'basic'
              }))
            );

          if (positionsError) {
            console.error("Error inserting positions:", positionsError);
            throw positionsError;
          }
        }

        toast({
          title: "Success",
          description: "Staff member updated successfully",
        });
      } else {
        // Create new employee
        const { data: employeeData, error: employeeError } = await supabase
          .from("employees")
          .insert([
            {
              ...formData,
              hiredate: new Date().toISOString(),
              isactive: true,
              position_id: primaryPosition,
            },
          ])
          .select()
          .single();

        if (employeeError) {
          console.error("Error creating employee:", employeeError);
          throw employeeError;
        }

        if (selectedPositions.length > 0) {
          const { error: positionsError } = await supabase
            .from("employeepositions")
            .insert(
              selectedPositions.map((position, index) => ({
                employeeid: employeeData.employeeid,
                positionid: position.positionid,
                payrate: position.payrate || position.defaultpayrate || 0,
                is_primary: index === 0,
                access_level: position.access_level || 'basic'
              }))
            );

          if (positionsError) {
            console.error("Error inserting positions:", positionsError);
            throw positionsError;
          }
        }

        toast({
          title: "Success",
          description: "Staff member added successfully",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${initialData ? 'update' : 'add'} staff member`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-fitness-card border-fitness-muted">
        <DialogHeader>
          <DialogTitle className="text-fitness-text">
            {initialData ? 'Edit Staff Member' : 'Add New Staff Member'}
          </DialogTitle>
        </DialogHeader>
        <StaffDialogForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewStaffDialog;