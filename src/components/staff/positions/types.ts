import type { Position } from "@/types/permissions";

export interface PositionWithPayRate extends Position {
  payrate: number;
}

export interface FormData {
  positionname: string;
  paytype: string;
  defaultpayrate: string;
  description: string;
  required_certifications: string;
  min_experience_months: string;
}