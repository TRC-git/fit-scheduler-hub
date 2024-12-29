import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, addMinutes, parse } from 'date-fns';

export const useTimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    loadOperatingHours();
  }, []);

  const loadOperatingHours = async () => {
    try {
      // First get the business location settings
      const { data: locationData, error: locationError } = await supabase
        .from('businesslocations')
        .select('opening_time, closing_time, slot_duration')
        .maybeSingle();

      if (locationError) throw locationError;

      if (locationData) {
        const slots = generateTimeSlots(
          locationData.opening_time || '09:00',
          locationData.closing_time || '17:00',
          locationData.slot_duration || 60
        );
        setTimeSlots(slots);
      }
    } catch (error) {
      console.error('Error loading operating hours:', error);
      // Fallback to default time slots if there's an error
      const slots = generateTimeSlots('09:00', '17:00', 60);
      setTimeSlots(slots);
    }
  };

  const generateTimeSlots = (startTime: string, endTime: string, duration: number): string[] => {
    const slots: string[] = [];
    const start = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());

    let current = start;
    while (current < end) {
      const next = addMinutes(current, duration);
      slots.push(`${format(current, 'h:mmaaa')} - ${format(next, 'h:mmaaa')}`);
      current = next;
    }

    return slots;
  };

  return { timeSlots };
};