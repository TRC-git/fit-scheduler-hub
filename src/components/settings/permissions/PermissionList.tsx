
import { Skeleton } from "@/components/ui/skeleton";
import type { PositionWithPermissions, PermissionSettingsType } from "@/types/permissions";
import { useState } from "react";
import { PositionPermissions } from "./components/PositionPermissions";

interface PermissionListProps {
  positions: PositionWithPermissions[];
  onEdit: (position: PositionWithPermissions) => void;
  onDelete: (positionId: number) => void;
  onSave: (positionId: number, permissions: PermissionSettingsType) => void;
  isLoading?: boolean;
}

export const PermissionList = ({
  positions,
  onDelete,
  onSave,
  isLoading
}: PermissionListProps) => {
  const [editingPosition, setEditingPosition] = useState<number | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<PermissionSettingsType | null>(null);

  const handleEdit = (position: PositionWithPermissions) => {
    setEditingPosition(position.positionid);
    setEditingPermissions({...position.access_level});
  };

  const handleCancel = () => {
    setEditingPosition(null);
    setEditingPermissions(null);
  };

  const handleSave = (positionId: number) => {
    if (editingPermissions) {
      onSave(positionId, editingPermissions);
      setEditingPosition(null);
      setEditingPermissions(null);
    }
  };

  const handlePermissionChange = (positionId: number, key: keyof PermissionSettingsType, value: boolean) => {
    if (editingPermissions) {
      const updatedPermissions = {
        ...editingPermissions,
        [key]: value,
      };
      setEditingPermissions(updatedPermissions);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-fitness-inner p-4 rounded-lg">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {positions?.map((position) => position.access_level && (
        <PositionPermissions
          key={position.positionid}
          position={position}
          isEditing={editingPosition === position.positionid}
          editingPermissions={editingPermissions}
          onEdit={() => handleEdit(position)}
          onDelete={() => onDelete(position.positionid)}
          onSave={() => handleSave(position.positionid)}
          onCancel={handleCancel}
          onPermissionChange={(key, value) => 
            handlePermissionChange(position.positionid, key, value)
          }
        />
      ))}
    </div>
  );
};
