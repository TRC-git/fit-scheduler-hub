import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { StaffSelect } from "./StaffSelect";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ClockInOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClockInOutDialog = ({ open, onOpenChange }: ClockInOutDialogProps) => {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleClockIn = async () => {
    if (!selectedStaff) {
      toast({
        title: "Error",
        description: "Please select a staff member",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get employee ID from the selected staff (format: "firstname lastname")
      const [firstName, lastName] = selectedStaff.split(" ").map(part => part.trim()).filter(Boolean);
      
      if (!firstName || !lastName) {
        throw new Error("Invalid staff name format");
      }

      const { data: employee, error: employeeError } = await supabase
        .from("employees")
        .select("employeeid")
        .eq("firstname", firstName)
        .eq("lastname", lastName)
        .maybeSingle();

      if (employeeError) {
        throw employeeError;
      }

      if (!employee) {
        throw new Error(`No employee found with name ${firstName} ${lastName}`);
      }

      // Create time entry
      const { error: timeEntryError } = await supabase.from("timeentries").insert({
        employeeid: employee.employeeid,
        clockintime: new Date().toISOString(),
      });

      if (timeEntryError) throw timeEntryError;

      toast({
        title: "Success",
        description: `${selectedStaff} has been clocked in successfully`,
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error clocking in:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to clock in",
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
          <DialogTitle className="text-fitness-text">Clock In</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <StaffSelect value={selectedStaff} onChange={setSelectedStaff} />
          <Button
            onClick={handleClockIn}
            className="w-full bg-fitness-accent text-[#333333] hover:bg-fitness-accent/90"
            disabled={loading}
          >
            {loading ? "Processing..." : "Clock In"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};