import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { PositionWithPermissions, PermissionSettingsType } from "@/types/permissions";
import { useState } from "react";
import { permissionGroups } from "./utils/permissionUtils";
import { PermissionGroup } from "./components/PermissionGroup";

interface PermissionListProps {
  positions: PositionWithPermissions[];
  onEdit: (position: PositionWithPermissions) => void;
  onDelete: (positionId: number) => void;
  onSave: (positionId: string, permissions: PermissionSettingsType) => void;
  isLoading?: boolean;
}

export const PermissionList = ({ 
  positions, 
  onDelete, 
  onSave,
  isLoading 
}: PermissionListProps) => {
  const [editingPosition, setEditingPosition] = useState<string | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<PermissionSettingsType | null>(null);

  const handleEdit = (position: PositionWithPermissions) => {
    setEditingPosition(position.positionid.toString());
    setEditingPermissions({...position.access_level});
  };

  const handleCancel = () => {
    setEditingPosition(null);
    setEditingPermissions(null);
  };

  const handleSave = (positionId: string) => {
    if (editingPermissions) {
      onSave(positionId, editingPermissions);
      setEditingPosition(null);
      setEditingPermissions(null);
    }
  };

  const handlePermissionChange = (key: keyof PermissionSettingsType, value: boolean) => {
    setEditingPermissions((prev) => prev ? {
      ...prev,
      [key]: value,
    } : null);
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
        <div key={position.positionid} className="bg-fitness-inner p-6 rounded-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-fitness-text font-medium text-2xl mb-2">{position.positionname}</h4>
              {position.description && (
                <p className="text-sm text-fitness-text/70 mt-1">{position.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              {editingPosition === position.positionid.toString() ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSave(position.positionid.toString())}
                    className="h-8 w-8"
                  >
                    <Check className="h-4 w-4 text-[#00f127]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancel}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(position)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4 text-fitness-text" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(position.positionid)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {Object.entries(permissionGroups).map(([groupName, permissions]) => (
              <PermissionGroup
                key={groupName}
                groupName={groupName}
                permissions={permissions}
                values={editingPosition === position.positionid.toString()
                  ? editingPermissions ?? {}
                  : position.access_level ?? {}}
                isEditing={editingPosition === position.positionid.toString()}
                onPermissionChange={handlePermissionChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};