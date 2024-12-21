import { AppointmentCell } from "./AppointmentCell";
import { Appointment } from "./types";

interface TimeSlotRowProps {
  timeSlot: string;
  days: string[];
  appointments: Appointment[];
  onDrop: (timeSlot: string, day: string) => void;
  onDelete: (appointmentId: string) => void;
  onAdd: (timeSlot: string, day: string) => void;
  onDragStart: (appointment: Appointment) => void;
}

export const TimeSlotRow = ({
  timeSlot,
  days,
  appointments,
  onDrop,
  onDelete,
  onAdd,
  onDragStart,
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
        />
      ))}
    </div>
  );
};