import { AppointmentCell } from "./AppointmentCell";
import { TimeSlotRowProps } from "./types";

export const TimeSlotRow = ({
  timeSlot,
  days,
  appointments,
  onDrop,
  onDelete,
  onAdd,
  onDragStart,
  onCopy,
  onUpdate,
  copiedAppointment,
}: TimeSlotRowProps) => {
  const getAppointmentForSlot = (timeSlot: string, day: string) => {
    return appointments.find((apt) => apt.timeSlot === timeSlot && apt.day === day);
  };

  const formatTimeSlot = (timeSlot: string) => {
    return (
      <div className="flex flex-row items-center justify-start space-x-1 text-sm whitespace-nowrap">
        <span>{timeSlot}</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-8 gap-4">
      <div className="text-fitness-text p-2 flex items-center min-w-[150px]">
        {formatTimeSlot(timeSlot)}
      </div>
      {days.map((day) => (
        <AppointmentCell
          key={`${timeSlot}-${day}`}
          appointment={getAppointmentForSlot(timeSlot, day)}
          timeSlot={timeSlot}
          day={day}
          onDrop={onDrop}
          onDelete={onDelete}
          onAdd={onAdd}
          onDragStart={onDragStart}
          onCopy={onCopy}
          onUpdate={onUpdate}
          copiedAppointment={copiedAppointment}
        />
      ))}
    </div>
  );
};