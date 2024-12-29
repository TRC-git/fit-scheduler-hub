import { TimeSlot } from "../dialog/types/availability";

export interface StaffResponse {
  employeeid: number;
  [key: string]: any;
}

export interface MutationParams {
  formData: any;
  selectedPositions: any[];
  initialData?: any;
  availability?: TimeSlot[];
}