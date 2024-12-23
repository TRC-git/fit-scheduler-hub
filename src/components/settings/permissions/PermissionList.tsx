import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { PositionWithPermissions } from "@/types/permissions";
import { useState } from "react";

interface PermissionListProps {
  positions: PositionWithPermissions[];
  onEdit: (position: PositionWithPermissions) => void;
  onDelete: (positionId: number) => void;
  onSave: (positionId: string, permissions: any) => void;
}

export const PermissionList = ({ positions, onDelete, onSave }: PermissionListProps) => {
  const [editingPosition, setEditingPosition] = useState<string | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<any>(null);

  const handleEdit = (position: PositionWithPermissions) => {
    setEditingPosition(position.positionid.toString());
    setEditingPermissions({...position.access_level});
  };

  const handleCancel = () => {
    setEditingPosition(null);
    setEditingPermissions(null);
  };

  const handleSave = (positionId: string) => {
    onSave(positionId, editingPermissions);
    setEditingPosition(null);
    setEditingPermissions(null);
  };

  const handlePermissionChange = (key: string, value: boolean) => {
    setEditingPermissions((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getIndicatorColor = (value: boolean): string => {
    return value === true ? 'bg-[#00f127]' : 'bg-[#ff0101]';
  };

  return (
    <div className="space-y-4">
      {positions?.map((position) => position.access_level && (
        <div key={position.positionid} className="bg-fitness-inner p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-fitness-text font-medium">{position.positionname}</h4>
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
          <div className="grid grid-cols-2 gap-2 text-sm text-fitness-text/70">
            {Object.entries(editingPosition === position.positionid.toString() ? editingPermissions : position.access_level).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-2 p-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getIndicatorColor(value as boolean)}`} />
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </div>
                {editingPosition === position.positionid.toString() && (
                  <Switch
                    checked={value as boolean}
                    onCheckedChange={(checked) => handlePermissionChange(key, checked)}
                    className="data-[state=checked]:bg-[#15e7fb]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};