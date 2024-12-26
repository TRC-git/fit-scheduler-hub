import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onCancel: () => void;
  loading: boolean;
  isEditing: boolean;
}

export const DialogActions = ({ onCancel, loading, isEditing }: DialogActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        className="text-fitness-text"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={loading}
        className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
      >
        {loading ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Update Staff Member" : "Add Staff Member")}
      </Button>
    </div>
  );
};