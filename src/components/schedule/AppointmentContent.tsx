import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EditAppointmentDialog } from "./EditAppointmentDialog";
import { DragHandle } from "./DragHandle";
import { DeleteButton } from "./DeleteButton";
import { Appointment } from "./types";

interface AppointmentContentProps {
  appointment: Appointment;
  onDelete: () => void;
}

export const AppointmentContent = ({ appointment, onDelete }: AppointmentContentProps) => (
  <div
    className="bg-fitness-inner p-2 rounded flex items-center justify-between cursor-move group"
    draggable="true"
  >
    <Dialog>
      <DialogTrigger className="flex-1 text-left">
        <div>
          <p className="text-fitness-text text-sm font-medium">{appointment.name}</p>
          <p className="text-xs text-gray-400">{appointment.type}</p>
        </div>
      </DialogTrigger>
      <EditAppointmentDialog appointment={appointment} />
    </Dialog>
    <div className="flex items-center gap-2">
      <DragHandle />
      <DeleteButton onDelete={onDelete} />
    </div>
  </div>
);