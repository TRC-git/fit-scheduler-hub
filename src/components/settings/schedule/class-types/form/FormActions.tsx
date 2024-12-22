import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  loading: boolean;
  isEditing: boolean;
}

const FormActions = ({ onCancel, loading, isEditing }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="border-[#15e7fb] text-fitness-text hover:bg-[#15e7fb]/10"
        disabled={loading}
      >
        Cancel
      </Button>
      <Button 
        type="submit"
        className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
        disabled={loading}
      >
        {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
      </Button>
    </div>
  );
};

export default FormActions;