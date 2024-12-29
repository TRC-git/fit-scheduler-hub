import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StaffDialogForm } from "./StaffDialogForm";
import { StaffResponse } from "../types/staff";
import { PositionWithPayRate } from "../positions/types";

interface StaffDialogContentProps {
  initialData?: any;
  onSubmit: (formData: any, selectedPositions: PositionWithPayRate[]) => Promise<StaffResponse>;
  onClose: () => void;
  loading: boolean;
}

export const StaffDialogContent = ({ 
  initialData, 
  onSubmit, 
  onClose, 
  loading 
}: StaffDialogContentProps) => {
  return (
    <DialogContent className="bg-fitness-card border-fitness-muted max-h-[90vh] w-[calc(100%+120px)] max-w-[calc(32rem+120px)]">
      <DialogHeader>
        <DialogTitle className="text-fitness-text">
          {initialData ? 'Edit Staff Member' : 'Add New Staff Member'}
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[calc(90vh-120px)] pr-4" style={{
        '--scrollbar-thumb': '#15e7fb',
        '--scrollbar-track': 'transparent'
      } as React.CSSProperties}>
        <StaffDialogForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </ScrollArea>
    </DialogContent>
  );
};