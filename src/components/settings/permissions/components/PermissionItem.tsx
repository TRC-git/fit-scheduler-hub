import { Switch } from "@/components/ui/switch";
import { PermissionIndicator } from "./PermissionIndicator";
import { getPermissionLabel } from "../utils/permissionUtils";
import type { PermissionSettingsType } from "@/types/permissions";

interface PermissionItemProps {
  permissionKey: keyof PermissionSettingsType;
  value: boolean;
  isEditing: boolean;
  onPermissionChange?: (key: keyof PermissionSettingsType, value: boolean) => void;
}

export const PermissionItem = ({
  permissionKey,
  value,
  isEditing,
  onPermissionChange,
}: PermissionItemProps) => {
  return (
    <div className="flex items-center justify-between gap-2 p-1">
      <div className="flex items-center gap-2">
        <PermissionIndicator value={value} />
        <span className="text-sm text-fitness-text">{getPermissionLabel(permissionKey)}</span>
      </div>
      {isEditing && onPermissionChange && (
        <Switch
          checked={value}
          onCheckedChange={(checked) => onPermissionChange(permissionKey, checked)}
          className="data-[state=checked]:bg-[#15e7fb]"
        />
      )}
    </div>
  );
};