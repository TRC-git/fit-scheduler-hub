import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PositionSelect } from "./positions/PositionSelect";

interface Position {
  positionid: number;
  positionname: string;
  defaultpayrate: number | null;
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
        firstname: initialData.firstname,
        lastname: initialData.lastname,
        email: initialData.email,
        phonenumber: initialData.phonenumber || "",
      });
      
      // Set selected positions from initialData
      const positions = initialData.employeepositions?.map((ep: any) => ({
        positionid: ep.positions.positionid,
        positionname: ep.positions.positionname,
        defaultpayrate: ep.payrate,
        access_level: ep.positions.access_level
      })) || [];
      setSelectedPositions(positions);
      console.log("Set selected positions:", positions);
    } else {
      // Reset form when adding new staff
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phonenumber: "",
      });
      setSelectedPositions([]);
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting form with positions:", selectedPositions);

    try {
      if (initialData) {
        // Update existing employee
        const { error: employeeError } = await supabase
          .from("employees")
          .update({
            ...formData,
            isactive: true,
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
                payrate: position.defaultpayrate || 0,
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
        // Insert new employee
        const { data: employeeData, error: employeeError } = await supabase
          .from("employees")
          .insert([
            {
              ...formData,
              hiredate: new Date().toISOString(),
              isactive: true,
            },
          ])
          .select()
          .single();

        if (employeeError) throw employeeError;

        // Insert employee positions
        if (selectedPositions.length > 0) {
          const { error: positionsError } = await supabase
            .from("employeepositions")
            .insert(
              selectedPositions.map((position, index) => ({
                employeeid: employeeData.employeeid,
                positionid: position.positionid,
                payrate: position.defaultpayrate || 0,
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname" className="text-fitness-text">First Name</Label>
              <Input
                id="firstname"
                value={formData.firstname}
                onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
                className="bg-fitness-inner text-fitness-text"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-fitness-text">Last Name</Label>
              <Input
                id="lastname"
                value={formData.lastname}
                onChange={(e) => setFormData(prev => ({ ...prev, lastname: e.target.value }))}
                className="bg-fitness-inner text-fitness-text"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-fitness-text">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-fitness-inner text-fitness-text"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-fitness-text">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phonenumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phonenumber: e.target.value }))}
              className="bg-fitness-inner text-fitness-text"
            />
          </div>
          
          <PositionSelect 
            selectedPositions={selectedPositions}
            onPositionsChange={setSelectedPositions}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-fitness-text"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
            >
              {loading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Staff Member" : "Add Staff Member")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewStaffDialog;