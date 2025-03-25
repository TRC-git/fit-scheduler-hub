
import type { Json } from "@/types/database/common";
import type { PermissionSettingsType } from "@/types/permissions";

// Define default permissions as a frozen object to prevent accidental mutations
export const defaultPermissions: PermissionSettingsType = Object.freeze({
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
});

// Create a new clean permissions object
export const createEmptyPermissions = (): PermissionSettingsType => {
  return { ...defaultPermissions };
};

// Safely convert permissions to JSON format for storage
export const convertToJson = (permissions: PermissionSettingsType | null | undefined): Json => {
  // Start with default permissions
  const safePermissions = permissions || defaultPermissions;
  const jsonObject: Record<string, boolean> = {};
  
  // Convert all values to boolean to ensure type safety
  Object.entries(safePermissions).forEach(([key, value]) => {
    jsonObject[key] = !!value;
  });
  
  return jsonObject;
};

// Group permissions by functional area for better UI organization
export const permissionGroups = {
  "Calendar Access": ["calendar_view", "calendar_edit", "calendar_manage"],
  "Employee Management": ["manage_employees", "manage_positions", "approve_timeoff"],
  "Payroll & Finance": ["manage_payroll", "approve_timesheets", "view_reports"],
  "Schedule Management": ["create_schedules", "modify_schedules", "approve_swaps"],
  "System Settings": ["manage_settings", "manage_locations"]
};

// Format permission keys for display in UI
export const getPermissionLabel = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper to check if a permissions object is complete (has all required fields)
export const isCompletePermissionsObject = (permissions: any): boolean => {
  if (!permissions) return false;
  
  return Object.keys(defaultPermissions).every(key => 
    Object.prototype.hasOwnProperty.call(permissions, key)
  );
};
