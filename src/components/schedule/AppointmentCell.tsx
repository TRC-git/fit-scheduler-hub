import { AppointmentContent } from "./AppointmentContent";
import { AddAppointmentButton } from "./AddAppointmentButton";
import { AppointmentCellProps, Appointment } from "./types";
import { useOperationalDays } from "@/contexts/operational-days/useOperationalDays";
import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";
import { useClassTypes } from "@/hooks/schedule/useClassTypes";

export const AppointmentCell = ({
  appointment,
  timeSlot,
  day,
  onDrop,
  onDelete,
  onAdd,
  onDragStart,
  onCopy,
  onUpdate,
  copiedAppointment,
}: AppointmentCellProps) => {
  const { operationalDays } = useOperationalDays();
  const { selectedScheduleType } = useScheduleContext();
  const { classTypes } = useClassTypes();
  const isOperational = operationalDays.has(day);

  const isTimeSlotAvailable = () => {
    if (!isOperational) return false;
    
    if (selectedScheduleType === 'all') return true;
    
    const selectedType = classTypes?.find(type => type.name === selectedScheduleType);
    if (!selectedType) return false;

    // Check if the time slot is within the schedule type's operational hours
    const [startTime] = timeSlot.split(' - ');
    const timeSlotHour = parseInt(startTime.split(':')[0]);
    const openingHour = parseInt(selectedType.opening_time?.split(':')[0] || '9');
    const closingHour = parseInt(selectedType.closing_time?.split(':')[0] || '17');

    return timeSlotHour >= openingHour && timeSlotHour < closingHour;
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isOperational || !isTimeSlotAvailable()) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('bg-fitness-inner/20');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isOperational || !isTimeSlotAvailable()) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-fitness-inner/20');
  };

  const handleDragStart = (e: React.DragEvent, appointment: Appointment) => {
    if (!isOperational || !isTimeSlotAvailable()) return;
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('appointment', JSON.stringify(appointment));
    onDragStart(appointment);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isOperational || !isTimeSlotAvailable()) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-fitness-inner/20');
    onDrop(timeSlot, day);
  };

  const handleClick = () => {
    if (!isOperational || !isTimeSlotAvailable() || !copiedAppointment) return;
    onAdd(timeSlot, day, copiedAppointment.name, copiedAppointment.type);
  };

  const isAvailable = isTimeSlotAvailable();

  return (
    <div
      className={`bg-fitness-muted rounded-md p-2 min-h-[80px] transition-colors duration-200 ${
        isOperational && isAvailable && copiedAppointment ? 'cursor-pointer hover:bg-fitness-inner/20' : ''
      } ${!isOperational || !isAvailable ? 'bg-red-900/20' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {appointment && isOperational && isAvailable ? (
        <div onDragStart={(e) => handleDragStart(e, appointment)}>
          <AppointmentContent
            appointment={appointment}
            onDelete={() => onDelete(appointment.id)}
            onCopy={() => onCopy(appointment)}
            onUpdate={onUpdate}
            isCopied={copiedAppointment?.id === appointment.id}
          />
        </div>
      ) : isOperational && isAvailable ? (
        <AddAppointmentButton
          timeSlot={timeSlot}
          day={day}
          onAdd={onAdd}
        />
      ) : (
        <div className="text-fitness-text/50 text-sm text-center h-full flex items-center justify-center">
          Not Available
        </div>
      )}
    </div>
  );
};