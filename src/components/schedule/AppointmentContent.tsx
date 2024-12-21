import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EditAppointmentDialog } from "./EditAppointmentDialog";
import { DragHandle } from "./DragHandle";
import { DeleteButton } from "./DeleteButton";
import { Copy } from "lucide-react";
import { Appointment } from "./types";

interface AppointmentContentProps {
  appointment: Appointment;
  onDelete: () => void;
  onCopy: () => void;
}

export const AppointmentContent = ({ appointment, onDelete, onCopy }: AppointmentContentProps) => (
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
      <Copy
        className="w-4 h-4 text-fitness-text cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onCopy();
        }}
      />
      <DeleteButton onDelete={onDelete} />
    </div>
  </div>
);