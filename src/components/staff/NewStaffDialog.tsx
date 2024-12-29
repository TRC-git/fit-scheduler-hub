import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StaffDialogForm } from "./dialog/StaffDialogForm";
import { useStaffMutations } from "./hooks/useStaffMutations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StaffResponse } from "./dialog/StaffDialogForm";
import { PositionWithPayRate } from "./positions/types";

interface NewStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
}

const NewStaffDialog = ({ open, onOpenChange, initialData }: NewStaffDialogProps) => {
  const { submitStaffForm, loading } = useStaffMutations();

  const handleSubmit = async (formData: any, selectedPositions: PositionWithPayRate[]): Promise<StaffResponse> => {
    const result = await submitStaffForm(formData, selectedPositions, initialData);
    if (result && typeof result === 'object' && 'employeeid' in result) {
      onOpenChange(false);
      return result as StaffResponse;
    }
    throw new Error("Failed to submit staff form");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            loading={loading}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NewStaffDialog;