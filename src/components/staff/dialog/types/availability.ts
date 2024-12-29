export interface TimeSlot {
  dayofweek: string;
  starttime: string;
  endtime: string;
  ispreferred?: boolean;
}

export interface AvailabilitySectionProps {
  employeeId?: number;
  initialAvailability?: TimeSlot[];
  onAvailabilityChange: (availability: TimeSlot[]) => void;
}