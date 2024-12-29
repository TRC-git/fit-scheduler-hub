import { TimeSlot } from "../dialog/availability/types";

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