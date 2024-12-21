export interface Appointment {
  id: string;
  name: string;
  type: string;
  timeSlot: string;
  day: string;
}

export interface AppointmentCellProps {
  appointment: Appointment | undefined;
  timeSlot: string;
  day: string;
  onDrop: (timeSlot: string, day: string) => void;
  onDelete: (appointmentId: string) => void;
  onAdd: (timeSlot: string, day: string) => void;
  onDragStart: (appointment: Appointment) => void;
}

export interface TimeSlotRowProps {
  timeSlot: string;
  days: string[];
  appointments: Appointment[];
  onDrop: (timeSlot: string, day: string) => void;
  onDelete: (appointmentId: string) => void;
  onAdd: (timeSlot: string, day: string) => void;
  onDragStart: (appointment: Appointment) => void;
}