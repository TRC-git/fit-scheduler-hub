import { Dialog } from "@/components/ui/dialog";
import { StaffDialogContent } from "./dialog/StaffDialogContent";
import { useStaffSubmitMutation } from "./hooks/mutations/useStaffSubmitMutation";
import { StaffResponse } from "./types/staff";
import { PositionWithPayRate } from "./positions/types";

interface NewStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
}

const NewStaffDialog = ({ open, onOpenChange, initialData }: NewStaffDialogProps) => {
  const mutation = useStaffSubmitMutation();

  const handleSubmit = async (formData: any, selectedPositions: PositionWithPayRate[]): Promise<StaffResponse> => {
    return new Promise((resolve, reject) => {
      mutation.mutate(
        { formData, selectedPositions, initialData },
        {
          onSuccess: (employeeId) => {
            onOpenChange(false);
            resolve({ employeeid: employeeId });
          },
          onError: (error) => {
            reject(error);
          },
        }
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <StaffDialogContent
        initialData={initialData}
        onSubmit={handleSubmit}
        onClose={() => onOpenChange(false)}
        loading={mutation.isPending}
      />
    </Dialog>
  );
};

export default NewStaffDialog;