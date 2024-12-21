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
import { Button } from "@/components/ui/button";

interface NewAppointmentDialogProps {
  timeSlot: string;
  day: string;
  onAdd: (timeSlot: string, day: string) => void;
}

export const NewAppointmentDialog = ({
  timeSlot,
  day,
  onAdd,
}: NewAppointmentDialogProps) => {
  return (
    <DialogContent className="bg-[#171717] border-0">
      <DialogHeader>
        <DialogTitle className="text-fitness-text">Add New Appointment</DialogTitle>
        <DialogDescription className="text-fitness-text/70">
          Create a new appointment for {day} at {timeSlot}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <div>
          <label className="text-sm font-medium text-fitness-text">Staff Name</label>
          <Select>
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
          <Select>
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
        <Button 
          onClick={() => onAdd(timeSlot, day)}
          className="bg-[#15e7fb] text-[#171717] hover:bg-[#15e7fb]/80"
        >
          Add Appointment
        </Button>
      </div>
    </DialogContent>
  );
};