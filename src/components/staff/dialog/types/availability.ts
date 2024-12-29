export interface TimeSlot {
  "5": number;  // This represents employeeid in the database
  dayofweek: string;
  starttime: string;
  endtime: string;
  ispreferred?: boolean;
  availabilityid?: number;
}