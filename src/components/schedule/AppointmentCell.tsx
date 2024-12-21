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
    e.stopPropagation();
    e.currentTarget.classList.add('bg-fitness-inner/20');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-fitness-inner/20');
  };

  const handleDragStart = (e: React.DragEvent, appointment: Appointment) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('appointment', JSON.stringify(appointment));
    onDragStart(appointment);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-fitness-inner/20');
    onDrop(timeSlot, day);
  };

  return (
    <div
      className="bg-fitness-muted rounded-md p-2 min-h-[80px] transition-colors duration-200"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {appointment ? (
        <div
          className="bg-fitness-inner p-2 rounded flex items-center justify-between cursor-move group"
          draggable="true"
          onDragStart={(e) => handleDragStart(e, appointment)}
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
            <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" />
            <Trash2
              className="w-4 h-4 text-fitness-danger cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(appointment.id);
              }}
            />
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};