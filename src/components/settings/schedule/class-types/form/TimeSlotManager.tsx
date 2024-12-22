import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { TimeSlot } from "@/types/schedule/class-types";
import TimeSlotGrid from "../../TimeSlotGrid";

interface TimeSlotManagerProps {
  classTypeId?: number;
  operationalDays: string[];
}

const TimeSlotManager = ({ classTypeId, operationalDays }: TimeSlotManagerProps) => {
  const { toast } = useToast();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Load existing time slots when editing
  useEffect(() => {
    if (classTypeId) {
      loadTimeSlots();
    }
  }, [classTypeId]);

  const loadTimeSlots = async () => {
    if (!classTypeId) return;

    try {
      const { data, error } = await supabase
        .from('class_time_slots')
        .select('*')
        .eq('class_type_id', classTypeId);

      if (error) throw error;
      if (data) setTimeSlots(data);
    } catch (error) {
      console.error('Error loading time slots:', error);
      toast({
        title: "Error",
        description: "Failed to load time slots",
        variant: "destructive",
      });
    }
  };

  // Initialize time slots when operational days change
  useEffect(() => {
    if (operationalDays && operationalDays.length > 0) {
      const existingDays = new Set(timeSlots.map(slot => slot.day_of_week));
      const newDays = operationalDays.filter(day => !existingDays.has(day));
      
      if (newDays.length > 0) {
        const initialSlots = newDays.map(day => ({
          day_of_week: day,
          start_time: "09:00",
          end_time: "10:00"
        }));
        setTimeSlots(prev => [...prev, ...initialSlots]);
      }
    }
  }, [operationalDays]);

  const addTimeSlot = (day: string) => {
    if (!day) return; // Prevent adding slots without a day
    setTimeSlots([...timeSlots, {
      day_of_week: day,
      start_time: "09:00",
      end_time: "10:00"
    }]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setTimeSlots(updatedSlots);
  };

  return (
    <TimeSlotGrid
      slots={timeSlots}
      onSlotsChange={setTimeSlots}
    />
  );
};

export default TimeSlotManager;