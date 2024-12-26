export interface TimeSlot {
  dayofweek: string;
  starttime: string;
  endtime: string;
  ispreferred?: boolean;
}

export interface AvailabilitySectionProps {
  availability: TimeSlot[];
  onChange: (availability: TimeSlot[]) => void;
}