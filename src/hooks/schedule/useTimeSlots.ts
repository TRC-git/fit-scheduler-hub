import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, parse, addMinutes } from 'date-fns';
import { BusinessLocation } from '@/types/database/business-location';
import { toast } from '@/hooks/use-toast';

export const useTimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const generateTimeSlots = (startTime: string, endTime: string, duration: number): string[] => {
    const slots: string[] = [];
    const start = parse(startTime, 'HH:mm:ss', new Date());
    const end = parse(endTime, 'HH:mm:ss', new Date());

    let current = start;
    while (current < end) {
      const next = addMinutes(current, duration);
      if (next > end) break;
      
      const formattedSlot = `${format(current, 'h:mm a')} - ${format(next, 'h:mm a')}`;
      slots.push(formattedSlot);
      current = next;
    }

    return slots;
  };

  const loadOperatingHours = async () => {
    try {
      const { data: locationData, error: locationError } = await supabase
        .from('businesslocations')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (locationError) {
        console.error('Error loading operating hours:', locationError);
        toast({
          title: "Error",
          description: "Failed to load operating hours. Using default values.",
          variant: "destructive",
        });
        const slots = generateTimeSlots('09:00:00', '17:00:00', 60);
        setTimeSlots(slots);
        return;
      }

      if (locationData) {
        const location = locationData as BusinessLocation;
        console.log('Location data:', location);
        const slots = generateTimeSlots(
          location.opening_time || '09:00:00',
          location.closing_time || '17:00:00',
          location.slot_duration || 60
        );
        setTimeSlots(slots);
      }
    } catch (error) {
      console.error('Error in loadOperatingHours:', error);
      toast({
        title: "Error",
        description: "Failed to load operating hours. Using default values.",
        variant: "destructive",
      });
      const slots = generateTimeSlots('09:00:00', '17:00:00', 60);
      setTimeSlots(slots);
    }
  };

  useEffect(() => {
    loadOperatingHours();
  }, []);

  return { timeSlots };
};