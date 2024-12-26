import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PositionSelect } from "./positions/PositionSelect";
import { StaffFormFields } from "./dialog/StaffFormFields";
import { DialogActions } from "./dialog/DialogActions";

interface Position {
  positionid: number;
  positionname: string;
  defaultpayrate: number | null;
  payrate?: number;
  access_level: any;
}

interface NewStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
}

const NewStaffDialog = ({ open, onOpenChange, initialData }: NewStaffDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
  });

  useEffect(() => {
    if (initialData) {
      console.log("Setting initial data:", initialData);
      setFormData({
        firstname: initialData.firstname || "",
        lastname: initialData.lastname || "",
        email: initialData.email || "",
        phonenumber: initialData.phonenumber || "",
      });
      
      // Transform employee positions data
      const positions = initialData.employeepositions?.map((ep: any) => ({
        positionid: ep.positions.positionid,
        positionname: ep.positions.positionname,
        defaultpayrate: ep.positions.defaultpayrate,
        payrate: ep.payrate || ep.positions.defaultpayrate,
        access_level: ep.positions.access_level
      })) || [];

      // Also include the primary position if it exists and isn't already included
      if (initialData.positions && !positions.some(p => p.positionid === initialData.positions.positionid)) {
        positions.push({
          positionid: initialData.positions.positionid,
          positionname: initialData.positions.positionname,
          defaultpayrate: initialData.positions.defaultpayrate,
          payrate: initialData.positions.defaultpayrate,
          access_level: initialData.positions.access_level
        });
      }

      console.log("Setting selected positions:", positions);
      setSelectedPositions(positions);
    } else {
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phonenumber: "",
      });
      setSelectedPositions([]);
    }
  }, [initialData, open]);

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting form with positions:", selectedPositions);

    try {
      const primaryPosition = selectedPositions[0]?.positionid || null;

      if (initialData) {
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
                access_level: position.access_level
              }))
            );

          if (positionsError) throw positionsError;
        }

        toast({
          title: "Success",
          description: "Staff member updated successfully",
        });
      } else {
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

        if (employeeError) throw employeeError;

        if (selectedPositions.length > 0) {
          const { error: positionsError } = await supabase
            .from("employeepositions")
            .insert(
              selectedPositions.map((position, index) => ({
                employeeid: employeeData.employeeid,
                positionid: position.positionid,
                payrate: position.payrate || position.defaultpayrate || 0,
                is_primary: index === 0,
                access_level: position.access_level
              }))
            );

          if (positionsError) throw positionsError;
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <StaffFormFields formData={formData} onChange={handleFormChange} />
          <PositionSelect 
            selectedPositions={selectedPositions}
            onPositionsChange={setSelectedPositions}
          />
          <DialogActions 
            onCancel={() => onOpenChange(false)}
            loading={loading}
            isEditing={!!initialData}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewStaffDialog;