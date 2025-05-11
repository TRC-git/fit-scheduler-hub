
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { OperationalDaysContextType } from './types';
import { loadOperationalDays, saveOperationalDays as saveOperationalDaysToDb } from './operations';

export const OperationalDaysContext = createContext<OperationalDaysContextType | undefined>(undefined);

export const OperationalDaysProvider = ({ children }: { children: React.ReactNode }) => {
  const [operationalDays, setOperationalDays] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handleLoadOperationalDays = useCallback(async () => {
    setIsLoading(true);
    try {
      const days = await loadOperationalDays();
      setOperationalDays(days);
    } catch (error) {
      console.error('Error loading operational days:', error);
      setOperationalDays(new Set(['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']));
      toast({
        title: "Notice",
        description: "Using default operational days",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    let isMounted = true;
    
    const loadDays = async () => {
      try {
        const days = await loadOperationalDays();
        if (isMounted) {
          setOperationalDays(days);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error loading operational days:', error);
          setOperationalDays(new Set(['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']));
          setIsLoading(false);
          toast({
            title: "Notice",
            description: "Using default operational days",
          });
        }
      }
    };
    
    loadDays();
    
    return () => {
      isMounted = false;
    };
  }, [toast]);

  const toggleDay = useCallback((day: string) => {
    setOperationalDays(prev => {
      const newDays = new Set(prev);
      if (newDays.has(day)) {
        newDays.delete(day);
      } else {
        newDays.add(day);
      }
      return newDays;
    });
  }, []);

  const handleSaveOperationalDays = useCallback(async () => {
    try {
      const success = await saveOperationalDaysToDb(operationalDays);
      
      if (success) {
        await handleLoadOperationalDays();
        
        toast({
          title: "Success",
          description: "Operational days saved successfully",
        });
      }
      return success;
    } catch (error) {
      console.error('Error saving operational days:', error);
      toast({
        title: "Error",
        description: "Failed to save operational days",
        variant: "destructive",
      });
      return false;
    }
  }, [operationalDays, handleLoadOperationalDays, toast]);

  return (
    <OperationalDaysContext.Provider value={{ 
      operationalDays, 
      toggleDay, 
      saveOperationalDays: handleSaveOperationalDays,
      reloadOperationalDays: handleLoadOperationalDays,
      isLoading
    }}>
      {children}
    </OperationalDaysContext.Provider>
  );
};
