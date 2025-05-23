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
  onAdd: (timeSlot: string, day: string, name: string, type: string) => void;
  onDragStart: (appointment: Appointment) => void;
  onCopy: (appointment: Appointment) => void;
  onUpdate?: (updatedAppointment: Appointment) => void;
  copiedAppointment?: Appointment | null;
}

export interface TimeSlotRowProps {
  timeSlot: string;
  days: string[];
  appointments: Appointment[];
  onDrop: (timeSlot: string, day: string) => void;
  onDelete: (appointmentId: string) => void;
  onAdd: (timeSlot: string, day: string, name: string, type: string) => void;
  onDragStart: (appointment: Appointment) => void;
  onCopy: (appointment: Appointment) => void;
  onUpdate?: (updatedAppointment: Appointment) => void;
  copiedAppointment?: Appointment | null;
}