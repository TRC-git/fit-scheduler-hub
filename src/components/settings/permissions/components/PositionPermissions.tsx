
import type { PositionWithPermissions, PermissionSettingsType } from "@/types/permissions";
import { PositionHeader } from "./PositionHeader";
import { PermissionGroup } from "./PermissionGroup";
import { permissionGroups, defaultPermissions } from "../utils/permissionUtils";
import { useMemo } from "react";

interface PositionPermissionsProps {
  position: PositionWithPermissions;
  isEditing: boolean;
  editingPermissions: PermissionSettingsType | null;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  onPermissionChange: (key: keyof PermissionSettingsType, value: boolean) => void;
}

export const PositionPermissions = ({
  position,
  isEditing,
  editingPermissions,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onPermissionChange,
}: PositionPermissionsProps) => {
  // Use memoization to avoid recalculating permissions on each render
  const currentPermissions = useMemo(() => {
    if (isEditing) {
      return editingPermissions || defaultPermissions;
    }
    return position.access_level || defaultPermissions;
  }, [isEditing, editingPermissions, position.access_level]);

  return (
    <div className="bg-fitness-inner p-6 rounded-lg">
      <PositionHeader
        positionName={position.positionname}
        description={position.description}
        isEditing={isEditing}
        onSave={onSave}
        onCancel={onCancel}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(permissionGroups).map(([groupName, permissions]) => (
          <PermissionGroup
            key={groupName}
            groupName={groupName}
            permissions={permissions}
            permissionValues={currentPermissions}
            isEditing={isEditing}
            onPermissionChange={onPermissionChange}
          />
        ))}
      </div>
    </div>
  );
};
