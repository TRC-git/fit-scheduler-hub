import type { PermissionSettingsType } from "@/types/permissions";

export interface Position {
  positionid: number;
  positionname: string;
  defaultpayrate?: number | null;
  description?: string | null;
  min_experience_months?: number | null;
  paytype?: string | null;
  required_certifications?: string[] | null;
  access_level?: PermissionSettingsType | null;
  payrate?: number;
}

export interface PositionWithPayRate extends Position {
  payrate?: number;
}

export interface FormData {
  positionname: string;
  paytype: string;
  defaultpayrate: string;
  description: string;
  required_certifications: string;
  min_experience_months: string;
}