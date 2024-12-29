import { Button } from "@/components/ui/button";
import { Pencil, Ban, Unlock, Trash2 } from "lucide-react";

interface StaffActionsProps {
  isSuspended: boolean;
  onEdit: () => void;
  onSuspend: () => void;
  onDelete: () => void;
}

export const StaffActions = ({ 
  isSuspended, 
  onEdit, 
  onSuspend, 
  onDelete 
}: StaffActionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-[#15e7fb]"
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={isSuspended ? "text-green-500" : "text-yellow-500"}
        onClick={onSuspend}
      >
        {isSuspended ? (
          <Unlock className="h-4 w-4" />
        ) : (
          <Ban className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-fitness-danger"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};