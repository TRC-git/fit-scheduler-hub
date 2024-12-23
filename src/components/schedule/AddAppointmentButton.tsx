import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { NewAppointmentDialog } from "./NewAppointmentDialog";

interface AddAppointmentButtonProps {
  timeSlot: string;
  day: string;
  onAdd: (timeSlot: string, day: string, name: string, type: string) => void;
}

export const AddAppointmentButton = ({ timeSlot, day, onAdd }: AddAppointmentButtonProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="ghost"
        className="w-full h-full flex items-center justify-center hover:bg-fitness-inner/20"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </DialogTrigger>
    <NewAppointmentDialog
      timeSlot={timeSlot}
      day={day}
      onAdd={onAdd}
    />
  </Dialog>
);