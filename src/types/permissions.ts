import { Json } from "@/types/database/common";

export interface PermissionSettings {
  calendar_view: boolean;
  calendar_edit: boolean;
  calendar_manage: boolean;
  manage_employees: boolean;
  manage_positions: boolean;
  manage_payroll: boolean;
}

export interface Position {
  positionid: number;
  positionname: string;
  defaultpayrate?: number | null;
  description?: string | null;
  min_experience_months?: number | null;
  paytype?: string | null;
  required_certifications?: string[] | null;
  access_level?: Json | null;
}

export type PositionWithPermissions = Omit<Position, 'access_level'> & {
  access_level?: PermissionSettings | null;
};