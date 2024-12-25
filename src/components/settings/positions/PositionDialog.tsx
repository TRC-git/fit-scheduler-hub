import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PositionForm } from "./PositionForm";
import { Position } from "./types";

interface PositionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPosition: Position | null;
  onSubmit: (positionData: Position) => void;
}

export const PositionDialog = ({ 
  isOpen, 
  onOpenChange, 
  selectedPosition, 
  onSubmit 
}: PositionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-fitness-card">
        <DialogHeader>
          <DialogTitle className="text-fitness-text">
            {selectedPosition ? 'Edit Position' : 'Add New Position'}
          </DialogTitle>
        </DialogHeader>
        <PositionForm 
          position={selectedPosition || undefined} 
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};