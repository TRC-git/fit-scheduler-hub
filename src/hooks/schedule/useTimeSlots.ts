import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, addHours, parse } from 'date-fns';

export const useTimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    loadOperatingHours();
  }, []);

  const loadOperatingHours = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_types')
        .select('opening_time, closing_time')
        .eq('name', 'default')
        .single();

      if (error) throw error;

      if (data) {
        const slots = generateTimeSlots(data.opening_time || '09:00', data.closing_time || '17:00');
        setTimeSlots(slots);
      }
    } catch (error) {
      console.error('Error loading operating hours:', error);
      // Fallback to default time slots if there's an error
      const slots = generateTimeSlots('09:00', '17:00');
      setTimeSlots(slots);
    }
  };

  const generateTimeSlots = (startTime: string, endTime: string): string[] => {
    const slots: string[] = [];
    const start = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());

    let current = start;
    while (current < end) {
      const next = addHours(current, 1);
      slots.push(`${format(current, 'h:mmaaa')} - ${format(next, 'h:mmaaa')}`);
      current = next;
    }

    return slots;
  };

  return { timeSlots };
};