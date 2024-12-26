import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PositionWithPayRate } from "../../positions/types";

interface StaffFormData {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
}

interface TimeSlot {
  dayofweek: string;
  starttime: string;
  endtime: string;
  ispreferred?: boolean;
}

export const useStaffFormSubmit = (
  initialData: any | undefined,
  onSubmit: (formData: any, positions: PositionWithPayRate[]) => Promise<any>,
  onClose: () => void
) => {
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
  ) => {
    setLoading(true);
    try {
      const result = await onSubmit(formData, selectedPositions);
      
      if (result) {
        const employeeId = initialData?.employeeid || result.employeeid;
        await handleAvailabilityUpdate(employeeId, availability);
        onClose();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in submitForm:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitForm,
    loading
  };
};