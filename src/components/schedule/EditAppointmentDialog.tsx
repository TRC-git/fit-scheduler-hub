import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Appointment } from "./types";
import { useClassTypes } from "@/hooks/schedule/useClassTypes";

interface EditAppointmentDialogProps {
  appointment: Appointment;
}

export const EditAppointmentDialog = ({
  appointment,
}: EditAppointmentDialogProps) => {
  const { classTypes, isLoading } = useClassTypes();

  return (
    <DialogContent className="bg-[#171717] border-0 w-[calc(100%-2rem)] max-w-[32rem]">
      <DialogHeader>
        <DialogTitle className="text-fitness-text">Edit Appointment</DialogTitle>
        <DialogDescription className="text-fitness-text/70">
          Edit appointment details for {appointment.name}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <div>
          <label className="text-sm font-medium text-fitness-text">Staff Name</label>
          <Select defaultValue={appointment.name}>
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
          <Select defaultValue={appointment.type}>
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
      </div>
    </DialogContent>
  );
};