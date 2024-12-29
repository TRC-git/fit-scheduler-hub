export interface PermissionSettingsType {
  // Calendar Permissions
  calendar_view: boolean;
  calendar_edit: boolean;
  calendar_manage: boolean;
  
  // Employee Management
  manage_employees: boolean;
  manage_positions: boolean;
  approve_timeoff: boolean; // New permission added
  
  // Payroll & Finance
  manage_payroll: boolean;
  approve_timesheets: boolean;
  view_reports: boolean;
  
  // Schedule Management
  create_schedules: boolean;
  modify_schedules: boolean;
  approve_swaps: boolean;
  
  // System Settings
  manage_settings: boolean;
  manage_locations: boolean;
}

export interface Position {
  positionid: number;
  positionname: string;
  defaultpayrate: number | null;
  description?: string | null;
  min_experience_months?: number | null;
  paytype?: string | null;
  required_certifications?: string[] | null;
  access_level: PermissionSettingsType | null;
  payrate?: number;
}

export type PositionWithPermissions = Position;