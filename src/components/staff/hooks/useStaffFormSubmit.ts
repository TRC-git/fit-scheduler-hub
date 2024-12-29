import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PositionWithPayRate } from "../positions/types";
import { TimeSlot } from "../dialog/types/availability";

interface StaffFormData {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  is_admin: boolean;
}

interface StaffResponse {
  employeeid: number;
  [key: string]: any;
}

export const useStaffFormSubmit = (
  initialData: any | undefined,
  onSubmit: (formData: any, positions: PositionWithPayRate[]) => Promise<StaffResponse>,
  onClose: () => void
) => {
  const [loading, setLoading] = useState(false);

  const handleAvailabilityUpdate = async (employeeId: number, availability: TimeSlot[]) => {
    // Delete existing availability
    await supabase
      .from('employeeavailability')
      .delete()
      .eq('5', employeeId);
    
    // Insert new availability
    if (availability.length > 0) {
      const availabilityData = availability.map(slot => ({
        "5": employeeId,
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
  ): Promise<StaffResponse | null> => {
    setLoading(true);
    try {
      const result = await onSubmit(formData, selectedPositions);
      
      if (result) {
        const employeeId = initialData?.employeeid || result.employeeid;
        await handleAvailabilityUpdate(employeeId, availability);
        onClose();
        return result;
      }
      return null;
    } catch (error) {
      console.error("Error in submitForm:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitForm,
    loading
  };
};