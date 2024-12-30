import { Button } from "@/components/ui/button";
import { Edit2, Lock, Save } from "lucide-react";

interface PayrollActionsProps {
  status: string;
  editMode: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onFinalize: () => void;
}

export const PayrollActions = ({
  status,
  editMode,
  onEditToggle,
  onSave,
  onFinalize
}: PayrollActionsProps) => {
  if (status !== 'draft') return null;

  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="outline"
        onClick={onEditToggle}
        className="bg-fitness-inner text-fitness-text"
      >
        <Edit2 className="w-4 h-4 mr-2" />
        {editMode ? "Cancel Edit" : "Edit"}
      </Button>
      {editMode && (
        <Button
          onClick={onSave}
          className="bg-fitness-accent text-black hover:bg-fitness-accent/80"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      )}
      <Button
        onClick={onFinalize}
        className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-black"
      >
        <Lock className="w-4 h-4 mr-2" />
        Finalize Payroll
      </Button>
    </div>
  );
};