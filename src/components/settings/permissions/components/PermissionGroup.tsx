import { PermissionItem } from "./PermissionItem";
import type { PermissionSettingsType } from "@/types/permissions";

interface PermissionGroupProps {
  groupName: string;
  permissions: (keyof PermissionSettingsType)[];
  values: Partial<PermissionSettingsType>;
  isEditing: boolean;
  onPermissionChange?: (key: keyof PermissionSettingsType, value: boolean) => void;
}

export const PermissionGroup = ({
  groupName,
  permissions,
  values,
  isEditing,
  onPermissionChange,
}: PermissionGroupProps) => {
  return (
    <div className="space-y-4">
      <h5 className="text-lg font-medium text-fitness-text/90 border-b border-fitness-muted pb-2">
        {groupName}
      </h5>
      <div className="space-y-3">
        {permissions.map((key) => (
          <PermissionItem
            key={key}
            permissionKey={key}
            value={values[key] ?? false}
            isEditing={isEditing}
            onPermissionChange={onPermissionChange}
          />
        ))}
      </div>
    </div>
  );
};