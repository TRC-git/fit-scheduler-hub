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
  defaultpayrate?: number;
  description?: string;
  min_experience_months?: number;
  paytype?: string;
  required_certifications?: string[];
  access_level?: PermissionSettings;
}