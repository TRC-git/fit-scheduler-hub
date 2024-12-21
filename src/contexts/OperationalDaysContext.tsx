import React, { createContext, useContext, useState } from 'react';

type OperationalDaysContextType = {
  operationalDays: Set<string>;
  toggleDay: (day: string) => void;
};

const OperationalDaysContext = createContext<OperationalDaysContextType | undefined>(undefined);

export const OperationalDaysProvider = ({ children }: { children: React.ReactNode }) => {
  const [operationalDays, setOperationalDays] = useState<Set<string>>(
    new Set(['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'])
  );

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

  return (
    <OperationalDaysContext.Provider value={{ operationalDays, toggleDay }}>
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