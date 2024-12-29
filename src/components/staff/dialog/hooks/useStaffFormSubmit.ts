import { supabase } from "@/integrations/supabase/client";
import { TimeSlot, TimeSlotInput } from "../types/availability";

export const useStaffFormSubmit = () => {
  const handleSubmit = async (employeeId: number, availability: TimeSlotInput[]) => {
    try {
      // Transform the availability data to match the database schema
      const transformedAvailability: Omit<TimeSlot, 'availabilityid'>[] = availability.map(slot => ({
        "5": employeeId,
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