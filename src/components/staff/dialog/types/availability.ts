export interface TimeSlot {
  "5": number;
  dayofweek: string;
  starttime: string;
  endtime: string;
  ispreferred: boolean;
  availabilityid?: number;
}

export interface TimeSlotInput {
  dayofweek: string;
  starttime: string;
  endtime: string;
  ispreferred: boolean;
}