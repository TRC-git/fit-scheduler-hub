import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PositionForm } from "./PositionForm";

interface PositionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPosition: any;
  onSubmit: (positionData: any) => void;
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
          position={selectedPosition} 
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};