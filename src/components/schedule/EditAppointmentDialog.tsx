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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Appointment</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <div>
          <label className="text-sm font-medium">Client Name</label>
          <Select defaultValue={appointment.name}>
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Heath Graham">Heath Graham</SelectItem>
              <SelectItem value="John Doe">John Doe</SelectItem>
              <SelectItem value="Jane Smith">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Class Type</label>
          <Select defaultValue={appointment.type}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CrossFit">CrossFit</SelectItem>
              <SelectItem value="Yoga">Yoga</SelectItem>
              <SelectItem value="HIIT">HIIT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </DialogContent>
  );
};