import { AppointmentContent } from "./AppointmentContent";
import { AddAppointmentButton } from "./AddAppointmentButton";
import { AppointmentCellProps, Appointment } from "./types";
import { useOperationalDays } from "@/contexts/OperationalDaysContext";

export const AppointmentCell = ({
  appointment,
  timeSlot,
  day,
  onDrop,
  onDelete,
  onAdd,
  onDragStart,
  onCopy,
  copiedAppointment,
}: AppointmentCellProps) => {
  const { operationalDays } = useOperationalDays();
  const isOperational = operationalDays.has(day);

  const handleDragOver = (e: React.DragEvent) => {
    if (!isOperational) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('bg-fitness-inner/20');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isOperational) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-fitness-inner/20');
  };

  const handleDragStart = (e: React.DragEvent, appointment: Appointment) => {
    if (!isOperational) return;
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('appointment', JSON.stringify(appointment));
    onDragStart(appointment);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isOperational) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-fitness-inner/20');
    onDrop(timeSlot, day);
  };

  const handleClick = () => {
    if (!isOperational) return;
    if (copiedAppointment) {
      onAdd(timeSlot, day);
    }
  };

  return (
    <div
      className={`bg-fitness-muted rounded-md p-2 min-h-[80px] transition-colors duration-200 ${
        isOperational && copiedAppointment ? 'cursor-pointer hover:bg-fitness-inner/20' : ''
      } ${!isOperational ? 'bg-red-900/20' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {appointment && isOperational ? (
        <div onDragStart={(e) => handleDragStart(e, appointment)}>
          <AppointmentContent
            appointment={appointment}
            onDelete={() => onDelete(appointment.id)}
            onCopy={() => onCopy(appointment)}
            isCopied={copiedAppointment?.id === appointment.id}
          />
        </div>
      ) : isOperational ? (
        <AddAppointmentButton
          timeSlot={timeSlot}
          day={day}
          onAdd={onAdd}
        />
      ) : null}
    </div>
  );
};