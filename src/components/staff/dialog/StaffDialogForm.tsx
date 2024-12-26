import { useState } from "react";
import { StaffFormFields } from "./StaffFormFields";
import { PositionSelect } from "../positions/PositionSelect";
import { DialogActions } from "./DialogActions";
import { PositionWithPayRate } from "../positions/types";
import { AvailabilitySection } from "./availability/AvailabilitySection";
import { useAvailability } from "./hooks/useAvailability";
import { useStaffFormSubmit } from "./hooks/useStaffFormSubmit";

interface StaffDialogFormProps {
  initialData?: any;
  onSubmit: (formData: any, positions: PositionWithPayRate[]) => Promise<any>;
  onCancel: () => void;
  loading: boolean;
}

export const StaffDialogForm = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  loading: parentLoading 
}: StaffDialogFormProps) => {
  const [selectedPositions, setSelectedPositions] = useState<PositionWithPayRate[]>([]);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
  });

  const { availability, setAvailability } = useAvailability(initialData?.employeeid);
  const { submitForm, loading } = useStaffFormSubmit(initialData, onSubmit, onCancel);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm(formData, selectedPositions, availability);
  };

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePositionsChange = (positions: PositionWithPayRate[]) => {
    setSelectedPositions(positions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StaffFormFields formData={formData} onChange={handleFormChange} />
      <PositionSelect 
        selectedPositions={selectedPositions}
        onPositionsChange={handlePositionsChange}
      />
      <AvailabilitySection 
        availability={availability}
        onChange={setAvailability}
      />
      <DialogActions 
        onCancel={onCancel}
        loading={loading || parentLoading}
        isEditing={!!initialData}
      />
    </form>
  );
};