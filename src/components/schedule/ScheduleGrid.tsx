import { useState } from "react";
import { TimeSlotRow } from "./TimeSlotRow";
import { toast } from "@/hooks/use-toast";
import { Appointment } from "./types";

const timeSlots = [
  "5:00am - 6:00am",
  "6:00am - 7:00am",
  "8:00am - 9:00am",
  "3:00pm - 4:00pm",
  "4:00pm - 5:00pm",
  "5:00pm - 6:00pm",
  "6:00pm - 7:00pm",
];

const days = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

const ScheduleGrid = () => {
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

  const handleDrop = (timeSlot: string, day: string) => {
    if (!draggedAppointment) return;

    // Check if there's already an appointment in the target slot
    const existingAppointment = appointments.find(
      apt => apt.timeSlot === timeSlot && apt.day === day
    );

    if (existingAppointment) {
      toast({
        title: "Cannot move appointment",
        description: "There is already an appointment in this time slot",
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
    // Check if there's already an appointment in this slot
    const existingAppointment = appointments.find(
      apt => apt.timeSlot === timeSlot && apt.day === day
    );

    if (existingAppointment) {
      toast({
        title: "Cannot add appointment",
        description: "There is already an appointment in this time slot",
      });
      return;
    }

    const newAppointment: Appointment = {
      id: Math.random().toString(),
      name: "New Client",
      type: "CrossFit",
      timeSlot,
      day,
    };
    setAppointments([...appointments, newAppointment]);
    toast({
      title: "Appointment added",
      description: "A new appointment has been added to the schedule",
    });
  };

  const handleDragStart = (appointment: Appointment) => {
    setDraggedAppointment(appointment);
  };

  return (
    <div className="bg-fitness-grid rounded-lg p-4">
      <div className="grid grid-cols-8 gap-2 mb-4">
        <div className="text-fitness-text font-medium p-2">Avail. Times</div>
        {days.map((day, index) => (
          <div
            key={day}
            className={`text-fitness-text font-medium p-2 text-center ${
              index === 6 ? "bg-red-900/20" : "bg-fitness-muted"
            } rounded-md`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {timeSlots.map((timeSlot) => (
          <TimeSlotRow
            key={timeSlot}
            timeSlot={timeSlot}
            days={days}
            appointments={appointments}
            onDrop={handleDrop}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default ScheduleGrid;