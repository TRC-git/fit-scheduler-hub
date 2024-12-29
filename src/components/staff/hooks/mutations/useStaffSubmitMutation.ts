import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MutationParams } from "../../types/staff";
import { TimeSlot, TimeSlotInput } from "../../dialog/types/availability";

export const useStaffSubmitMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleEmployeePositions = async (
    employeeId: number,
    selectedPositions: any[]
  ) => {
    // First delete existing positions
    const { error: deleteError } = await supabase
      .from("employeepositions")
      .delete()
      .eq("employeeid", employeeId);

    if (deleteError) throw deleteError;

    if (selectedPositions.length === 0) return;

    // Insert new positions
    const positionsToInsert = selectedPositions.map((position, index) => ({
      employeeid: employeeId,
      positionid: position.positionid,
      payrate: position.payrate || position.defaultpayrate || 0,
      is_primary: index === 0,
      access_level: position.access_level ? JSON.stringify(position.access_level) : 'basic'
    }));

    const { error: insertError } = await supabase
      .from("employeepositions")
      .insert(positionsToInsert);

    if (insertError) throw insertError;
  };

  const handleAvailability = async (
    employeeId: number,
    availability: TimeSlotInput[]
  ) => {
    // Delete existing availability
    const { error: deleteError } = await supabase
      .from("employeeavailability")
      .delete()
      .eq("5", employeeId);

    if (deleteError) throw deleteError;

    if (availability.length === 0) return;

    // Transform availability records to match database schema
    const availabilityRecords: Omit<TimeSlot, 'availabilityid'>[] = availability.map(slot => ({
      "5": employeeId,
      dayofweek: slot.dayofweek,
      starttime: slot.starttime,
      endtime: slot.endtime,
      ispreferred: slot.ispreferred
    }));

    const { error: insertError } = await supabase
      .from("employeeavailability")
      .insert(availabilityRecords);

    if (insertError) throw insertError;
  };

  return useMutation({
    mutationFn: async ({
      formData,
      selectedPositions,
      initialData,
      availability = []
    }: MutationParams) => {
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

      // Handle availability with proper type casting
      await handleAvailability(employeeId, availability as TimeSlotInput[]);

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