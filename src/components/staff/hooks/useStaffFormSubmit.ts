import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PositionWithPayRate } from "../positions/types";
import { TimeSlot } from "../dialog/types/availability";
import { StaffResponse } from "../dialog/StaffDialogForm";

interface StaffFormData {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  is_admin: boolean;
}

export const useStaffFormSubmit = (
  initialData: any | undefined,
  onSubmit: (formData: any, positions: PositionWithPayRate[]) => Promise<StaffResponse>,
  onClose: () => void
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleAvailabilityUpdate = async (employeeId: number, availability: TimeSlot[]) => {
    // Delete existing availability
    await supabase
      .from('employeeavailability')
      .delete()
      .eq('employeeid', employeeId);
    
    // Insert new availability
    if (availability.length > 0) {
      const availabilityData = availability.map(slot => ({
        employeeid: employeeId,
        dayofweek: slot.dayofweek,
        starttime: slot.starttime,
        endtime: slot.endtime,
        ispreferred: slot.ispreferred || false
      }));
      
      await supabase
        .from('employeeavailability')
        .insert(availabilityData);
    }
  };

  const submitForm = async (
    formData: StaffFormData,
    selectedPositions: PositionWithPayRate[],
    availability: TimeSlot[]
  ): Promise<StaffResponse> => {
    setLoading(true);
    try {
      const result = await onSubmit(formData, selectedPositions);
      
      if (result) {
        const employeeId = initialData?.employeeid || result.employeeid;
        await handleAvailabilityUpdate(employeeId, availability);
        onClose();
        return result;
      }
      throw new Error("Failed to submit staff form");
    } catch (error) {
      console.error("Error in submitForm:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitForm,
    loading
  };
};