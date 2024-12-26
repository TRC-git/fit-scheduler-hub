import { useState, useEffect } from "react";
import { StaffFormFields } from "./StaffFormFields";
import { PositionSelect } from "../positions/PositionSelect";
import { DialogActions } from "./DialogActions";
import { PositionWithPayRate } from "../positions/types";
import { AvailabilitySection } from "./AvailabilitySection";
import { supabase } from "@/integrations/supabase/client";

interface StaffDialogFormProps {
  initialData?: any;
  onSubmit: (formData: any, positions: PositionWithPayRate[]) => void;
  onCancel: () => void;
  loading: boolean;
}

export const StaffDialogForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading 
}: StaffDialogFormProps) => {
  const [selectedPositions, setSelectedPositions] = useState<PositionWithPayRate[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
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
    } else {
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phonenumber: "",
      });
      setSelectedPositions([]);
      setAvailability([]);
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
    
    // First submit the form data and get the employee ID
    const success = await onSubmit(formData, selectedPositions);
    
    if (success && (initialData?.employeeid || success.employeeid)) {
      const employeeId = initialData?.employeeid || success.employeeid;
      
      // Delete existing availability
      await supabase
        .from('employeeavailability')
        .delete()
        .eq('employeeid', employeeId);
      
      // Insert new availability
      if (availability.length > 0) {
        const availabilityData = availability.map(slot => ({
          employeeid: employeeId,
          dayofweek: slot.dayofweek,
          starttime: slot.starttime,
          endtime: slot.endtime,
          ispreferred: slot.ispreferred || false
        }));
        
        await supabase
          .from('employeeavailability')
          .insert(availabilityData);
      }
    }
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
        loading={loading}
        isEditing={!!initialData}
      />
    </form>
  );
};