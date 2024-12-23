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
        title: "Cannot move schedule",
        description: "There is already a schedule in this time slot",
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
      title: "Schedule moved",
      description: `${draggedAppointment.name}'s schedule has been moved to ${day} ${timeSlot}`,
    });
  };

  const handleDelete = (appointmentId: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== appointmentId));
    toast({
      title: "Schedule deleted",
      description: "The schedule has been removed",
    });
  };

  const handleAdd = (timeSlot: string, day: string, name: string, type: string) => {
    const existingAppointment = appointments.find(
      apt => apt.timeSlot === timeSlot && apt.day === day
    );

    if (existingAppointment) {
      toast({
        title: "Cannot add schedule",
        description: "There is already a schedule in this time slot",
        variant: "destructive",
      });
      return;
    }

    const newAppointment: Appointment = {
      id: Math.random().toString(),
      name,
      type,
      timeSlot,
      day,
    };

    setAppointments([...appointments, newAppointment]);
    setCopiedAppointment(null);
    toast({
      title: "Schedule added",
      description: `${newAppointment.name}'s schedule has been added to ${day} ${timeSlot}`,
    });
  };

  const handleDragStart = (appointment: Appointment) => {
    setDraggedAppointment(appointment);
  };

  const handleCopy = (appointment: Appointment) => {
    setCopiedAppointment(appointment);
    toast({
      title: "Schedule copied",
      description: "Click any empty slot to paste the schedule",
    });
  };

  const handleUpdate = (updatedAppointment: Appointment) => {
    const updatedAppointments = appointments.map((apt) =>
      apt.id === updatedAppointment.id ? updatedAppointment : apt
    );
    setAppointments(updatedAppointments);
    toast({
      title: "Schedule updated",
      description: `${updatedAppointment.name}'s schedule has been updated`,
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
    handleUpdate,
  };
};