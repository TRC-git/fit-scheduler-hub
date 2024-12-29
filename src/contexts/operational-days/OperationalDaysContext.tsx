import React, { createContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { OperationalDaysContextType } from './types';
import { loadOperationalDays, saveOperationalDays } from './operations';

export const OperationalDaysContext = createContext<OperationalDaysContextType | undefined>(undefined);

export const OperationalDaysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [operationalDays, setOperationalDays] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleLoadOperationalDays = async () => {
    try {
      const days = await loadOperationalDays();
      setOperationalDays(days);
    } catch (error) {
      console.error('Error loading operational days:', error);
      // Set default days if loading fails
      setOperationalDays(new Set(['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']));
      toast({
        title: "Notice",
        description: "Using default operational days",
      });
    }
  };

  useEffect(() => {
    handleLoadOperationalDays();
  }, []);

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

  const handleSaveOperationalDays = async () => {
    try {
      await saveOperationalDays(operationalDays);
      await handleLoadOperationalDays();
      
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
    <OperationalDaysContext.Provider value={{ 
      operationalDays, 
      toggleDay, 
      saveOperationalDays: handleSaveOperationalDays,
      reloadOperationalDays: handleLoadOperationalDays 
    }}>
      {children}
    </OperationalDaysContext.Provider>
  );
};