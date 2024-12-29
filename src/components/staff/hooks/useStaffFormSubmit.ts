import { supabase } from "@/integrations/supabase/client";
import { TimeSlot } from "../dialog/types/availability";

export const useStaffFormSubmit = () => {
  const handleSubmit = async (employeeId: number, availability: Omit<TimeSlot, "5">[]) => {
    try {
      // Transform the availability data to match the database schema
      const transformedAvailability = availability.map(slot => ({
        "5": employeeId,  // This matches the database column name
        dayofweek: slot.dayofweek,
        starttime: slot.starttime,
        endtime: slot.endtime,
        ispreferred: slot.ispreferred
      }));

      const { error } = await supabase
        .from('employeeavailability')
        .insert(transformedAvailability);

      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error submitting staff form:', error);
      return { success: false, error };
    }
  };

  return { handleSubmit };
};