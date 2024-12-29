import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

interface DialogActionsProps {
  onConfirm: () => void;
  onClose: () => void;
  disabled: boolean;
}

export const DialogActions = ({ onConfirm, onClose, disabled }: DialogActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <DialogClose asChild>
        <Button
          variant="outline"
          onClick={onClose}
          className="bg-[#333333] text-fitness-text hover:bg-[#444444]"
        >
          Cancel
        </Button>
      </DialogClose>
      <DialogClose asChild>
        <Button
          onClick={onConfirm}
          className="bg-[#15e7fb] text-[#1A1F2C] hover:bg-[#15e7fb]/80"
          disabled={disabled}
        >
          Save Changes
        </Button>
      </DialogClose>
    </div>
  );
};