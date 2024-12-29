export interface TimeSlot {
  "5": number;  // This matches the database column name
  dayofweek: string;
  starttime: string;
  endtime: string;
  ispreferred?: boolean;
  availabilityid?: number;
}