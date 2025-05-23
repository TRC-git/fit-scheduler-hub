import { useState, useEffect } from "react";
import { TimeSlot } from "@/types/schedule/class-types";
import { supabase } from "@/integrations/supabase/client";

export const useTimeSlots = (scheduleTypeId?: number) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const loadTimeSlots = async () => {
    if (!scheduleTypeId) return;

    try {
      const { data, error } = await supabase
        .from('schedule_time_slots')
        .select('*')
        .eq('schedule_type_id', scheduleTypeId);

      if (error) throw error;
      if (data) setTimeSlots(data as TimeSlot[]);
    } catch (error) {
      console.error('Error loading time slots:', error);
      throw error;
    }
  };

  const addTimeSlot = (day: string) => {
    if (!day) return;
    setTimeSlots(prev => [...prev, {
      day_of_week: day,
      start_time: "09:00",
      end_time: "10:00"
    }]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(prev => prev.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    setTimeSlots(prev => {
      const newSlots = [...prev];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return newSlots;
    });
  };

  const handleDayToggle = (day: string, currentDays: string[]) => {
    if (!currentDays.includes(day)) {
      addTimeSlot(day);
    } else {
      setTimeSlots(prev => prev.filter(slot => slot.day_of_week !== day));
    }
  };

  useEffect(() => {
    if (scheduleTypeId) {
      loadTimeSlots();
    }
  }, [scheduleTypeId]);

  return {
    timeSlots,
    setTimeSlots,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    handleDayToggle
  };
};