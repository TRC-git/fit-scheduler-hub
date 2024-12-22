import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type OperationalDaysContextType = {
  operationalDays: Set<string>;
  toggleDay: (day: string) => void;
  saveOperationalDays: () => Promise<void>;
};

const OperationalDaysContext = createContext<OperationalDaysContextType | undefined>(undefined);

export const OperationalDaysProvider = ({ children }: { children: React.ReactNode }) => {
  const [operationalDays, setOperationalDays] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    loadOperationalDays();
  }, []);

  const loadOperationalDays = async () => {
    try {
      // Try to get the default class type
      const { data: settings, error } = await supabase
        .from('class_types')
        .select('operational_days')
        .eq('name', 'default')
        .maybeSingle();

      if (error) throw error;

      // If default class type doesn't exist, create it
      if (!settings) {
        const { error: insertError } = await supabase
          .from('class_types')
          .insert({
            name: 'default',
            duration: 60,
            operational_days: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']
          });

        if (insertError) throw insertError;

        setOperationalDays(new Set(['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']));
      } else if (settings.operational_days) {
        setOperationalDays(new Set(settings.operational_days));
      } else {
        // Default to Mon-Sat if no settings found
        setOperationalDays(new Set(['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']));
      }
    } catch (error) {
      console.error('Error loading operational days:', error);
      toast({
        title: "Error",
        description: "Failed to load operational days",
        variant: "destructive",
      });
    }
  };

  const toggleDay = (day: string) => {
    setOperationalDays(prev => {
      const newDays = new Set(prev);
      if (newDays.has(day)) {
        newDays.delete(day);
      } else {
        newDays.add(day);
      }
      return newDays;
    });
  };

  const saveOperationalDays = async () => {
    try {
      const { error } = await supabase
        .from('class_types')
        .update({ 
          operational_days: Array.from(operationalDays) 
        })
        .eq('name', 'default');

      if (error) throw error;

      toast({
        title: "Success",
        description: "Operational days saved successfully",
      });
    } catch (error) {
      console.error('Error saving operational days:', error);
      toast({
        title: "Error",
        description: "Failed to save operational days",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <OperationalDaysContext.Provider value={{ operationalDays, toggleDay, saveOperationalDays }}>
      {children}
    </OperationalDaysContext.Provider>
  );
};

export const useOperationalDays = () => {
  const context = useContext(OperationalDaysContext);
  if (context === undefined) {
    throw new Error('useOperationalDays must be used within an OperationalDaysProvider');
  }
  return context;
};