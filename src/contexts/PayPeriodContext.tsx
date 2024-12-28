import React, { createContext, useContext, useState } from 'react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays } from 'date-fns';

type PayPeriodType = 'weekly' | 'biweekly' | 'monthly' | 'semimonthly';

interface PayPeriodContextType {
  payPeriodType: PayPeriodType;
  setPayPeriodType: (type: PayPeriodType) => void;
  getPayPeriodRange: (date: Date) => { startDate: Date; endDate: Date };
}

const PayPeriodContext = createContext<PayPeriodContextType | undefined>(undefined);

export const PayPeriodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [payPeriodType, setPayPeriodType] = useState<PayPeriodType>('biweekly');

  const getPayPeriodRange = (date: Date) => {
    switch (payPeriodType) {
      case 'weekly':
        return {
          startDate: startOfWeek(date, { weekStartsOn: 1 }),
          endDate: endOfWeek(date, { weekStartsOn: 1 }),
        };
      case 'biweekly': {
        const startOfWeekDate = startOfWeek(date, { weekStartsOn: 1 });
        const weekNumber = Math.floor(date.getDate() / 14);
        const biweeklyStart = addDays(startOfWeekDate, weekNumber * 14);
        return {
          startDate: biweeklyStart,
          endDate: addDays(biweeklyStart, 13),
        };
      }
      case 'monthly':
        return {
          startDate: startOfMonth(date),
          endDate: endOfMonth(date),
        };
      case 'semimonthly': {
        const day = date.getDate();
        if (day <= 15) {
          return {
            startDate: startOfMonth(date),
            endDate: new Date(date.getFullYear(), date.getMonth(), 15),
          };
        } else {
          return {
            startDate: new Date(date.getFullYear(), date.getMonth(), 16),
            endDate: endOfMonth(date),
          };
        }
      }
      default:
        return {
          startDate: startOfWeek(date, { weekStartsOn: 1 }),
          endDate: endOfWeek(date, { weekStartsOn: 1 }),
        };
    }
  };

  return (
    <PayPeriodContext.Provider value={{ payPeriodType, setPayPeriodType, getPayPeriodRange }}>
      {children}
    </PayPeriodContext.Provider>
  );
};

export const usePayPeriod = () => {
  const context = useContext(PayPeriodContext);
  if (context === undefined) {
    throw new Error('usePayPeriod must be used within a PayPeriodProvider');
  }
  return context;
};