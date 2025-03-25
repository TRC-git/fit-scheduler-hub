
import type { Json } from "@/types/database/common";
import type { PermissionSettingsType } from "@/types/permissions";

export const defaultPermissions: PermissionSettingsType = {
  calendar_view: false,
  calendar_edit: false,
  calendar_manage: false,
  manage_employees: false,
  manage_positions: false,
  approve_timeoff: false,
  manage_payroll: false,
  approve_timesheets: false,
  view_reports: false,
  create_schedules: false,
  modify_schedules: false,
  approve_swaps: false,
  manage_settings: false,
  manage_locations: false
};

export const createEmptyPermissions = (): PermissionSettingsType => {
  return { ...defaultPermissions };
};

export const convertToJson = (permissions: PermissionSettingsType): Json => {
  // Ensure we're working with a valid permissions object
  const safePermissions = permissions || defaultPermissions;
  const jsonObject: Record<string, boolean> = {};
  Object.entries(safePermissions).forEach(([key, value]) => {
    jsonObject[key] = !!value; // Convert to boolean to ensure type safety
  });
  return jsonObject;
};

export const permissionGroups = {
  "Calendar Access": ["calendar_view", "calendar_edit", "calendar_manage"],
  "Employee Management": ["manage_employees", "manage_positions", "approve_timeoff"],
  "Payroll & Finance": ["manage_payroll", "approve_timesheets", "view_reports"],
  "Schedule Management": ["create_schedules", "modify_schedules", "approve_swaps"],
  "System Settings": ["manage_settings", "manage_locations"]
};

export const getPermissionLabel = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
