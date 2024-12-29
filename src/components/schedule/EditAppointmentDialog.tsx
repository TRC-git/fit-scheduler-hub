import { DialogContent } from "@/components/ui/dialog";
import { Appointment } from "./types";
import { useState } from "react";
import { DialogHeader } from "./dialog/DialogHeader";
import { StaffSelect } from "./dialog/StaffSelect";
import { TypeSelect } from "./dialog/TypeSelect";
import { DialogActions } from "./dialog/DialogActions";

interface EditAppointmentDialogProps {
  appointment: Appointment;
  onUpdate?: (updatedAppointment: Appointment) => void;
}

export const EditAppointmentDialog = ({
  appointment,
  onUpdate,
}: EditAppointmentDialogProps) => {
  const [selectedStaff, setSelectedStaff] = useState<string>(appointment.name);
  const [selectedType, setSelectedType] = useState<string>(appointment.type);

  const handleSubmit = () => {
    if (!selectedStaff || !selectedType) {
      return;
    }
    
    const updatedAppointment = {
      ...appointment,
      name: selectedStaff,
      type: selectedType
    };
    
    onUpdate?.(updatedAppointment);
  };

  return (
    <DialogContent className="bg-[#171717] border-0 w-[calc(100%-2rem)] max-w-[32rem]">
      <DialogHeader 
        title="Edit Schedule"
        description={`Edit schedule details for ${appointment.name}`}
      />
      <div className="space-y-4 pt-4">
        <StaffSelect value={selectedStaff} onChange={setSelectedStaff} />
        <TypeSelect value={selectedType} onChange={setSelectedType} />
        <DialogActions 
          onConfirm={handleSubmit}
          onClose={() => {}}
          disabled={!selectedStaff || !selectedType}
        />
      </div>
    </DialogContent>
  );
};