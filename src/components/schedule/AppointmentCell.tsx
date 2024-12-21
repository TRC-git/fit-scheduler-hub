import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EditAppointmentDialog } from "./EditAppointmentDialog";
import { NewAppointmentDialog } from "./NewAppointmentDialog";
import { Appointment } from "./types";

interface AppointmentCellProps {
  appointment: Appointment | undefined;
  timeSlot: string;
  day: string;
  onDrop: (timeSlot: string, day: string) => void;
  onDelete: (appointmentId: string) => void;
  onAdd: (timeSlot: string, day: string) => void;
  onDragStart: (appointment: Appointment) => void;
}

export const AppointmentCell = ({
  appointment,
  timeSlot,
  day,
  onDrop,
  onDelete,
  onAdd,
  onDragStart,
}: AppointmentCellProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-fitness-inner/20');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-fitness-inner/20');
  };

  const handleDragStart = (e: React.DragEvent, appointment: Appointment) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', appointment.id);
    onDragStart(appointment);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-fitness-inner/20');
    onDrop(timeSlot, day);
  };

  return (
    <div
      className="bg-fitness-muted rounded-md p-2 min-h-[60px] transition-colors duration-200"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {appointment ? (
        <div
          className="bg-fitness-inner p-2 rounded flex items-center justify-between cursor-move group"
          draggable
          onDragStart={(e) => handleDragStart(e, appointment)}
        >
          <Dialog>
            <DialogTrigger className="flex-1 text-left">
              <div>
                <p className="text-fitness-text text-sm">{appointment.name}</p>
                <p className="text-xs text-gray-400">{appointment.type}</p>
              </div>
            </DialogTrigger>
            <EditAppointmentDialog appointment={appointment} />
          </Dialog>
          <GripVertical className="w-4 h-4 text-gray-400 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Trash2
            className="w-4 h-4 text-fitness-danger cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(appointment.id);
            }}
          />
        </div>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-full flex items-center justify-center"
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
      )}
    </div>
  );
};