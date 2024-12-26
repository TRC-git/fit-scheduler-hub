import { useState, useEffect } from "react";
import { StaffFormFields } from "./StaffFormFields";
import { PositionSelect } from "../positions/PositionSelect";
import { DialogActions } from "./DialogActions";
import { PositionWithPayRate } from "../positions/types";
import { AvailabilitySection } from "./AvailabilitySection";
import { supabase } from "@/integrations/supabase/client";
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
  const [availability, setAvailability] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
  });

  const { submitForm, loading } = useStaffFormSubmit(initialData, onSubmit, onCancel);

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
        access_level: ep.positions.access_level,
        description: ep.positions.description,
        min_experience_months: ep.positions.min_experience_months,
        paytype: ep.positions.paytype,
        required_certifications: ep.positions.required_certifications
      })) || [];

      // Include primary position if it exists and isn't already included
      if (initialData.positions && !positions.some(p => p.positionid === initialData.positions.positionid)) {
        positions.push({
          positionid: initialData.positions.positionid,
          positionname: initialData.positions.positionname,
          defaultpayrate: initialData.positions.defaultpayrate || 0,
          payrate: initialData.positions.defaultpayrate || 0,
          access_level: initialData.positions.access_level,
          description: initialData.positions.description,
          min_experience_months: initialData.positions.min_experience_months,
          paytype: initialData.positions.paytype,
          required_certifications: initialData.positions.required_certifications
        });
      }

      setSelectedPositions(positions);

      // Fetch availability if editing
      if (initialData.employeeid) {
        fetchAvailability(initialData.employeeid);
      }
    }
  }, [initialData]);

  const fetchAvailability = async (employeeId: number) => {
    const { data } = await supabase
      .from('employeeavailability')
      .select('*')
      .eq('employeeid', employeeId);
    
    if (data) {
      setAvailability(data);
    }
  };

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