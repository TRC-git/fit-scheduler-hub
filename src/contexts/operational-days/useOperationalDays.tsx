import { useContext } from 'react';
import { OperationalDaysContext } from './OperationalDaysContext';

export const useOperationalDays = () => {
  const context = useContext(OperationalDaysContext);
  if (context === undefined) {
    throw new Error('useOperationalDays must be used within an OperationalDaysProvider');
  }
  return context;
};