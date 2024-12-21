import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onDelete: () => void;
}

export const DeleteButton = ({ onDelete }: DeleteButtonProps) => (
  <Trash2
    className="w-4 h-4 text-fitness-danger cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
    onClick={(e) => {
      e.stopPropagation();
      onDelete();
    }}
  />
);