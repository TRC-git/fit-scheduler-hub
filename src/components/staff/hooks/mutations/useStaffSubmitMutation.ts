import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MutationParams } from "../../types/staff";
import { TimeSlot } from "../../dialog/types/availability";

export const useStaffSubmitMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formData,
      selectedPositions,
      initialData,
      availability
    }: MutationParams): Promise<number> => {
      let employeeId: number;

      if (initialData) {
        // Update existing employee
        const { error } = await supabase
          .from("employees")
          .update({
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            phonenumber: formData.phonenumber,
            is_admin: formData.is_admin
          })
          .eq("employeeid", initialData.employeeid);

        if (error) throw error;
        employeeId = initialData.employeeid;
      } else {
        // Insert new employee
        const { data, error } = await supabase
          .from("employees")
          .insert([
            {
              ...formData,
              hiredate: new Date().toISOString(),
              isactive: true,
              position_id: selectedPositions[0]?.positionid || null,
            },
          ])
          .select()
          .single();

        if (error) throw error;
        employeeId = data.employeeid;
      }

      // Handle employee positions
      await handleEmployeePositions(employeeId, selectedPositions);

      // Handle availability
      if (availability && availability.length > 0) {
        // First delete existing availability
        const { error: deleteError } = await supabase
          .from("employeeavailability")
          .delete()
          .eq("employeeid", employeeId);

        if (deleteError) throw deleteError;

        // Insert new availability records
        const availabilityRecords = availability.map(slot => ({
          employeeid: employeeId,
          dayofweek: slot.dayofweek,
          starttime: slot.starttime,
          endtime: slot.endtime,
          ispreferred: slot.ispreferred || false
        }));

        const { error: insertError } = await supabase
          .from("employeeavailability")
          .insert(availabilityRecords);

        if (insertError) throw insertError;
      }

      return employeeId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Success",
        description: "Staff member saved successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Error in staff mutation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save staff member",
        variant: "destructive",
      });
    },
  });
};

const handleEmployeePositions = async (
  employeeId: number,
  selectedPositions: any[]
) => {
  if (selectedPositions.length === 0) return;

  const { error: deleteError } = await supabase
    .from("employeepositions")
    .delete()
    .eq("employeeid", employeeId);

  if (deleteError) throw deleteError;

  const positionsToInsert = selectedPositions.map((position, index) => ({
    employeeid: employeeId,
    positionid: position.positionid,
    payrate: position.payrate || position.defaultpayrate || 0,
    is_primary: index === 0,
    access_level: position.access_level ? JSON.stringify(position.access_level) : 'basic'
  }));

  const { error: positionsError } = await supabase
    .from("employeepositions")
    .insert(positionsToInsert);

  if (positionsError) throw positionsError;
};