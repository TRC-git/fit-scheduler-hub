import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StaffDialogForm } from "./dialog/StaffDialogForm";
import { useStaffMutations } from "./hooks/useStaffMutations";

interface NewStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
}

const NewStaffDialog = ({ open, onOpenChange, initialData }: NewStaffDialogProps) => {
  const { submitStaffForm, loading } = useStaffMutations();

  const handleSubmit = async (formData: any, selectedPositions: any) => {
    const success = await submitStaffForm(formData, selectedPositions, initialData);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-fitness-card border-fitness-muted max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-fitness-text">
            {initialData ? 'Edit Staff Member' : 'Add New Staff Member'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea 
          className="pr-4" 
          style={{
            '--scrollbar-thumb': '#15e7fb',
            '--scrollbar-track': 'transparent'
          } as React.CSSProperties}
        >
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