import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { TimeSlot } from '../types/availability';
import { useToast } from '@/hooks/use-toast';

export const useAvailability = (employeeId?: number) => {
  const [availability, setAvailability] = useState<TimeSlot[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (employeeId) {
      fetchAvailability(employeeId);
    }
  }, [employeeId]);

  const fetchAvailability = async (employeeId: number) => {
    const { data, error } = await supabase
      .from('employeeavailability')
      .select('*')
      .eq('5', employeeId);
    
    if (error) {
      console.error('Error fetching availability:', error);
      return;
    }
    
    if (data) {
      setAvailability(data);
    }
  };

  const handleAvailabilitySubmit = async (employeeId: number, availabilityData: TimeSlot[]) => {
    try {
      // First, delete existing availability for this employee
      const { error: deleteError } = await supabase
        .from('employeeavailability')
        .delete()
        .eq('5', employeeId);

      if (deleteError) throw deleteError;

      // Then insert new availability records
      if (availabilityData.length > 0) {
        const availabilityRecords = availabilityData.map(slot => ({
          "5": employeeId,
          dayofweek: slot.dayofweek,
          starttime: slot.starttime,
          endtime: slot.endtime,
          ispreferred: slot.ispreferred || false
        }));

        const { error: insertError } = await supabase
          .from('employeeavailability')
          .insert(availabilityRecords);

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Availability updated successfully",
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleAvailabilityChange = (newAvailability: TimeSlot[]) => {
    setAvailability(newAvailability);
  };

  return {
    availability,
    setAvailability: handleAvailabilityChange,
    handleAvailabilitySubmit
  };
};