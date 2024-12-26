import { useState, useEffect } from "react";
import { StaffFormFields } from "./StaffFormFields";
import { PositionSelect } from "../positions/PositionSelect";
import { DialogActions } from "./DialogActions";
import { Position } from "../positions/types";

interface StaffDialogFormProps {
  initialData?: any;
  onSubmit: (formData: any, positions: Position[]) => void;
  onCancel: () => void;
  loading: boolean;
}

export const StaffDialogForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading 
}: StaffDialogFormProps) => {
  const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstname: initialData.firstname || "",
        lastname: initialData.lastname || "",
        email: initialData.email || "",
        phonenumber: initialData.phonenumber || "",
      });
      
      // Transform employee positions data
      const positions = initialData.employeepositions?.map((ep: any) => ({
        positionid: ep.positions.positionid,
        positionname: ep.positions.positionname,
        defaultpayrate: ep.positions.defaultpayrate || 0,
        payrate: ep.payrate || ep.positions.defaultpayrate || 0,
        access_level: ep.positions.access_level
      })) || [];

      // Include primary position if it exists and isn't already included
      if (initialData.positions && !positions.some(p => p.positionid === initialData.positions.positionid)) {
        positions.push({
          positionid: initialData.positions.positionid,
          positionname: initialData.positions.positionname,
          defaultpayrate: initialData.positions.defaultpayrate || 0,
          payrate: initialData.positions.defaultpayrate || 0,
          access_level: initialData.positions.access_level
        });
      }

      setSelectedPositions(positions);
    } else {
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phonenumber: "",
      });
      setSelectedPositions([]);
    }
  }, [initialData]);

  const handleFormChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, selectedPositions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StaffFormFields formData={formData} onChange={handleFormChange} />
      <PositionSelect 
        selectedPositions={selectedPositions}
        onPositionsChange={setSelectedPositions}
      />
      <DialogActions 
        onCancel={onCancel}
        loading={loading}
        isEditing={!!initialData}
      />
    </form>
  );
};
