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

interface EditAppointmentDialogProps {
  appointment: Appointment;
}

export const EditAppointmentDialog = ({
  appointment,
}: EditAppointmentDialogProps) => {
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
          <label className="text-sm font-medium text-fitness-text">Class Type</label>
          <Select defaultValue={appointment.type}>
            <SelectTrigger className="bg-[#333333] border-[#d1d1d1] text-fitness-text">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-[#333333] border-[#d1d1d1]">
              <SelectItem value="CrossFit" className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]">CrossFit</SelectItem>
              <SelectItem value="Yoga" className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]">Yoga</SelectItem>
              <SelectItem value="HIIT" className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]">HIIT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </DialogContent>
  );
};