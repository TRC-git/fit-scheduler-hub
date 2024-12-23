import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { PositionWithPermissions } from "@/types/permissions";

interface PermissionListProps {
  positions: PositionWithPermissions[];
  onEdit: (position: PositionWithPermissions) => void;
  onDelete: (positionId: number) => void;
}

export const PermissionList = ({ positions, onEdit, onDelete }: PermissionListProps) => {
  const getIndicatorColor = (value: boolean | null | undefined): string => {
    return value === true ? 'bg-[#00f127]' : 'bg-[#ff0101]';
  };

  return (
    <div className="space-y-4">
      {positions?.map((position) => position.access_level && (
        <div key={position.positionid} className="bg-fitness-inner p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-fitness-text font-medium">{position.positionname}</h4>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(position)}
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
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-fitness-text/70">
            {Object.entries(position.access_level).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getIndicatorColor(value as boolean)}`} />
                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};