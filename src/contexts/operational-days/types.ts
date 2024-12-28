export type OperationalDaysContextType = {
  operationalDays: Set<string>;
  toggleDay: (day: string) => void;
  saveOperationalDays: () => Promise<void>;
  reloadOperationalDays: () => Promise<void>;
  isLoading: boolean;
};