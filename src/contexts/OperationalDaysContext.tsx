import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type OperationalDaysContextType = {
  operationalDays: Set<string>;
  toggleDay: (day: string) => void;
  saveOperationalDays: () => Promise<void>;
  reloadOperationalDays: () => Promise<void>;
};

const OperationalDaysContext = createContext<OperationalDaysContextType | undefined>(undefined);

export const OperationalDaysProvider = ({ children }: { children: React.ReactNode }) => {
  const [operationalDays, setOperationalDays] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const loadOperationalDays = async () => {
    try {
      const { data: settings, error } = await supabase
        .from('schedule_types')
        .select('operational_days')
        .eq('name', 'default')
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          const defaultDays = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
          const { error: insertError } = await supabase
            .from('schedule_types')
            .insert({
              name: 'default',
              duration: 60,
              operational_days: defaultDays
            });

          if (insertError) throw insertError;
          setOperationalDays(new Set(defaultDays));
        } else {
          throw error;
        }
      } else if (settings?.operational_days) {
        setOperationalDays(new Set(settings.operational_days));
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
        .from('schedule_types')
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

  useEffect(() => {
    loadOperationalDays();
  }, []);

  return (
    <OperationalDaysContext.Provider value={{ 
      operationalDays, 
      toggleDay, 
      saveOperationalDays,
      reloadOperationalDays: loadOperationalDays 
    }}>
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