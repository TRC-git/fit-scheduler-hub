import { Switch } from "@/components/ui/switch";
import type { PermissionSettingsType } from "@/types/permissions";
import { getPermissionLabel } from "../utils/permissionUtils";

interface PermissionGroupProps {
  groupName: string;
  permissions: string[];
  permissionValues: PermissionSettingsType;
  isEditing: boolean;
  onPermissionChange: (key: keyof PermissionSettingsType, value: boolean) => void;
}

export const PermissionGroup = ({
  groupName,
  permissions,
  permissionValues,
  isEditing,
  onPermissionChange,
}: PermissionGroupProps) => {
  const getIndicatorColor = (value: boolean): string => {
    return value ? 'bg-[#00f127]' : 'bg-[#ff0101]';
  };

  return (
    <div className="space-y-4">
      <h5 className="text-lg font-medium text-fitness-text/90 border-b border-fitness-muted pb-2">
        {groupName}
      </h5>
      <div className="space-y-3">
        {permissions.map((key) => {
          const permissionValue = permissionValues[key as keyof PermissionSettingsType] ?? false;

          return (
            <div key={key} className="flex items-center justify-between gap-2 p-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${getIndicatorColor(permissionValue)}`}
                />
                <span className="text-sm">{getPermissionLabel(key)}</span>
              </div>
              {isEditing && (
                <Switch
                  checked={permissionValue}
                  onCheckedChange={(checked) =>
                    onPermissionChange(key as keyof PermissionSettingsType, checked)
                  }
                  className="data-[state=checked]:bg-[#15e7fb]"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};