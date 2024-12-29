import { createContext, useContext, useState, ReactNode } from 'react';

interface ScheduleContextType {
  selectedScheduleType: string;
  setSelectedScheduleType: (type: string) => void;
  dates: Date[];
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [selectedScheduleType, setSelectedScheduleType] = useState('all');
  
  // Generate dates for the next 30 days
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <ScheduleContext.Provider value={{ selectedScheduleType, setSelectedScheduleType, dates }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useScheduleContext must be used within a ScheduleProvider');
  }
  return context;
};