export interface TimeSlot {
  dayofweek: string;
  starttime: string;
  endtime: string;
  ispreferred: boolean; // Changed from optional to required
}