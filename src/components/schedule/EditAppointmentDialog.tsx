import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Appointment } from "./types";

interface EditAppointmentDialogProps {
  appointment: Appointment;
}

export const EditAppointmentDialog = ({
  appointment,
}: EditAppointmentDialogProps) => {
  return (
    <DialogContent className="bg-[#171717] border-0">
      <DialogHeader>
        <DialogTitle className="text-fitness-text">Edit Appointment</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <div>
          <label className="text-sm font-medium text-fitness-text">Staff Name</label>
          <Select defaultValue={appointment.name}>
            <SelectTrigger className="bg-[#333333] border-[#d1d1d1] text-fitness-text">
              <SelectValue placeholder="Select staff" />
            </SelectTrigger>
            <SelectContent className="bg-[#333333] border-[#d1d1d1]">
              <SelectItem value="Heath Graham" className="text-fitness-text hover:bg-[#171717]">Heath Graham</SelectItem>
              <SelectItem value="John Doe" className="text-fitness-text hover:bg-[#171717]">John Doe</SelectItem>
              <SelectItem value="Jane Smith" className="text-fitness-text hover:bg-[#171717]">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-fitness-text">Class Type</label>
          <Select defaultValue={appointment.type}>
            <SelectTrigger className="bg-[#333333] border-[#d1d1d1] text-fitness-text">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-[#333333] border-[#d1d1d1]">
              <SelectItem value="CrossFit" className="text-fitness-text hover:bg-[#171717]">CrossFit</SelectItem>
              <SelectItem value="Yoga" className="text-fitness-text hover:bg-[#171717]">Yoga</SelectItem>
              <SelectItem value="HIIT" className="text-fitness-text hover:bg-[#171717]">HIIT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </DialogContent>
  );
};