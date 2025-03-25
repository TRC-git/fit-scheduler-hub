
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
import { useQueryClient } from "@tanstack/react-query";

interface ClockInOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClockInOutDialog = ({ open, onOpenChange }: ClockInOutDialogProps) => {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      // Split and clean up the name parts
      const nameParts = selectedStaff.split(" ").map(part => part.trim()).filter(Boolean);
      
      if (nameParts.length < 2) {
        throw new Error("Invalid staff name format");
      }

      // The first part is the first name, the rest is the last name (handles middle names)
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      console.log("Looking up employee:", { firstName, lastName });

      // Use .eq for each column separately 
      // since there might be multiple employees with same name
      const { data: employees, error: employeeError } = await supabase
        .from("employees")
        .select("employeeid, positions!employees_position_id_fkey (positionid)")
        .eq("firstname", firstName)
        .eq("lastname", lastName);

      if (employeeError) {
        throw employeeError;
      }

      if (!employees || employees.length === 0) {
        throw new Error(`No employee found with name ${firstName} ${lastName}`);
      }

      // Use the first matching employee
      const employee = employees[0];

      // Check if employee is already clocked in - removing maybeSingle() here too
      const { data: activeTimeEntries, error: activeTimeEntryError } = await supabase
        .from("timeentries")
        .select("timeentryid")
        .eq("employeeid", employee.employeeid)
        .is("clockouttime", null);

      if (activeTimeEntryError) {
        throw activeTimeEntryError;
      }

      if (activeTimeEntries && activeTimeEntries.length > 0) {
        throw new Error(`${selectedStaff} is already clocked in`);
      }

      // Create time entry
      const { error: timeEntryError } = await supabase.from("timeentries").insert({
        employeeid: employee.employeeid,
        positionid: employee.positions?.positionid,
        clockintime: new Date().toISOString(),
      });

      if (timeEntryError) throw timeEntryError;

      toast({
        title: "Success",
        description: `${selectedStaff} has been clocked in successfully`,
      });

      // Invalidate the timeEntries query to force a refetch
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      
      onOpenChange(false);
      setSelectedStaff("");
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
