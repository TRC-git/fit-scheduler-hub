import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X, Check } from "lucide-react";

interface PositionHeaderProps {
  positionName: string;
  description?: string | null;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const PositionHeader = ({
  positionName,
  description,
  isEditing,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: PositionHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h4 className="text-fitness-text font-medium text-2xl mb-2">{positionName}</h4>
        {description && (
          <p className="text-sm text-fitness-text/70 mt-1">{description}</p>
        )}
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSave}
              className="h-8 w-8"
            >
              <Check className="h-4 w-4 text-[#00f127]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
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
              onClick={onEdit}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4 text-fitness-text" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};