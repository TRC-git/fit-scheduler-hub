import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { TimeSlot } from '../types/availability';

export const useAvailability = (employeeId?: number) => {
  const [availability, setAvailability] = useState<TimeSlot[]>([]);

  useEffect(() => {
    if (employeeId) {
      fetchAvailability(employeeId);
    }
  }, [employeeId]);

  const fetchAvailability = async (employeeId: number) => {
    const { data } = await supabase
      .from('employeeavailability')
      .select('*')
      .eq('employeeid', employeeId);
    
    if (data) {
      setAvailability(data);
    }
  };

  const handleAvailabilityChange = (newAvailability: TimeSlot[]) => {
    setAvailability(newAvailability);
  };

  return {
    availability,
    setAvailability: handleAvailabilityChange
  };
};