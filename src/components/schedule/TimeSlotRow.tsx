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
}: TimeSlotRowProps) => {
  const getAppointmentForSlot = (timeSlot: string, day: string) => {
    return appointments.find((apt) => apt.timeSlot === timeSlot && apt.day === day);
  };

  return (
    <div className="grid grid-cols-8 gap-2">
      <div className="text-fitness-text p-2">{timeSlot}</div>
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
        />
      ))}
    </div>
  );
};