import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Appointment } from "@/components/schedule/types";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      name: "Heath Graham",
      type: "CrossFit",
      timeSlot: "5:00am - 6:00am",
      day: "Mon",
    },
  ]);
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);
  const [copiedAppointment, setCopiedAppointment] = useState<Appointment | null>(null);

  const handleDrop = (timeSlot: string, day: string) => {
    if (!draggedAppointment) return;

    if (draggedAppointment.timeSlot === timeSlot && draggedAppointment.day === day) {
      setDraggedAppointment(null);
      return;
    }

    const existingAppointment = appointments.find(
      apt => apt.timeSlot === timeSlot && apt.day === day
    );

    if (existingAppointment) {
      toast({
        title: "Cannot move appointment",
        description: "There is already an appointment in this time slot",
        variant: "destructive",
      });
      return;
    }

    const updatedAppointments = appointments.map((apt) =>
      apt.id === draggedAppointment.id
        ? { ...apt, timeSlot, day }
        : apt
    );
    setAppointments(updatedAppointments);
    setDraggedAppointment(null);
    toast({
      title: "Appointment moved",
      description: `${draggedAppointment.name}'s appointment has been moved to ${day} ${timeSlot}`,
    });
  };

  const handleDelete = (appointmentId: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== appointmentId));
    toast({
      title: "Appointment deleted",
      description: "The appointment has been removed from the schedule",
    });
  };

  const handleAdd = (timeSlot: string, day: string) => {
    const existingAppointment = appointments.find(
      apt => apt.timeSlot === timeSlot && apt.day === day
    );

    if (existingAppointment) {
      toast({
        title: "Cannot add appointment",
        description: "There is already an appointment in this time slot",
        variant: "destructive",
      });
      return;
    }

    const newAppointment: Appointment = copiedAppointment
      ? {
          ...copiedAppointment,
          id: Math.random().toString(),
          timeSlot,
          day,
        }
      : {
          id: Math.random().toString(),
          name: "Heath Graham",
          type: "CrossFit",
          timeSlot,
          day,
        };

    setAppointments([...appointments, newAppointment]);
    setCopiedAppointment(null);
    toast({
      title: "Appointment added",
      description: `${newAppointment.name}'s appointment has been added to ${day} ${timeSlot}`,
    });
  };

  const handleDragStart = (appointment: Appointment) => {
    setDraggedAppointment(appointment);
  };

  const handleCopy = (appointment: Appointment) => {
    setCopiedAppointment(appointment);
    toast({
      title: "Appointment copied",
      description: "Click any empty slot to paste the appointment",
    });
  };

  return {
    appointments,
    copiedAppointment,
    handleDrop,
    handleDelete,
    handleAdd,
    handleDragStart,
    handleCopy,
  };
};