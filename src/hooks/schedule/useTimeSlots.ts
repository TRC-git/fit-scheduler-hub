import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, addMinutes, parse } from 'date-fns';
import { BusinessLocation } from '@/types/database/business-location';

export const useTimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    loadOperatingHours();
  }, []);

  const loadOperatingHours = async () => {
    try {
      const { data: locationData, error: locationError } = await supabase
        .from('businesslocations')
        .select('*')
        .maybeSingle();

      if (locationError) throw locationError;

      if (locationData) {
        const location = locationData as BusinessLocation;
        const slots = generateTimeSlots(
          location.opening_time || '09:00',
          location.closing_time || '17:00',
          location.slot_duration || 60
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