import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Appointment } from "./types";
import { useClassTypes } from "@/hooks/schedule/useClassTypes";
import { useState } from "react";

interface EditAppointmentDialogProps {
  appointment: Appointment;
  onUpdate?: (updatedAppointment: Appointment) => void;
}

export const EditAppointmentDialog = ({
  appointment,
  onUpdate,
}: EditAppointmentDialogProps) => {
  const { classTypes, isLoading } = useClassTypes();
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
      <DialogHeader>
        <DialogTitle className="text-fitness-text">Edit Schedule</DialogTitle>
        <DialogDescription className="text-fitness-text/70">
          Edit schedule details for {selectedStaff}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <div>
          <label className="text-sm font-medium text-fitness-text">Staff Name</label>
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger className="bg-[#333333] border-[#d1d1d1] text-fitness-text">
              <SelectValue placeholder="Select staff" />
            </SelectTrigger>
            <SelectContent className="bg-[#333333] border-[#d1d1d1]">
              <SelectItem value="Heath Graham" className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]">Heath Graham</SelectItem>
              <SelectItem value="John Doe" className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]">John Doe</SelectItem>
              <SelectItem value="Jane Smith" className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-fitness-text">Schedule Type</label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="bg-[#333333] border-[#d1d1d1] text-fitness-text">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-[#333333] border-[#d1d1d1]">
              {isLoading ? (
                <SelectItem value="loading" className="text-fitness-text">Loading...</SelectItem>
              ) : (
                classTypes?.map((type) => (
                  <SelectItem 
                    key={type.class_type_id} 
                    value={type.name}
                    className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]"
                  >
                    {type.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-[#333333] text-fitness-text hover:bg-[#444444]"
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={handleSubmit}
              className="bg-[#15e7fb] text-[#1A1F2C] hover:bg-[#15e7fb]/80"
              disabled={!selectedStaff || !selectedType}
            >
              Save Changes
            </Button>
          </DialogClose>
        </div>
      </div>
    </DialogContent>
  );
};