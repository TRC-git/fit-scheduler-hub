import { createContext, useContext, useState, ReactNode } from 'react';

interface ScheduleContextType {
  selectedScheduleType: string;
  setSelectedScheduleType: (type: string) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [selectedScheduleType, setSelectedScheduleType] = useState('all');

  return (
    <ScheduleContext.Provider value={{ selectedScheduleType, setSelectedScheduleType }}>
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