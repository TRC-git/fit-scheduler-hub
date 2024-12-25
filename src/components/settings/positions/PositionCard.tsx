import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Position } from "./types";
import { formatPayType, formatPayRate } from "./utils/formatters";

interface PositionCardProps {
  position: Position;
  onEdit: () => void;
  onDelete: () => void;
}

export const PositionCard = ({ position, onEdit, onDelete }: PositionCardProps) => {
  return (
    <div className="p-4 bg-fitness-inner rounded-md flex justify-between items-center">
      <div>
        <h4 className="text-fitness-text font-medium">{position.positionname}</h4>
        <p className="text-fitness-text/70 text-sm mt-1">
          Pay Rate: ${formatPayRate(position.defaultpayrate)} {formatPayType(position.paytype || '')}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8 hover:bg-fitness-card/10"
        >
          <Pencil className="h-4 w-4 text-fitness-text" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 hover:bg-fitness-card/10"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
};