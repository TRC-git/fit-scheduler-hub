import { useState } from "react";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

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

interface Appointment {
  id: string;
  name: string;
  type: string;
  timeSlot: string;
  day: string;
}

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
  const [selectedSlot, setSelectedSlot] = useState<{ timeSlot: string; day: string } | null>(null);

  const handleDragStart = (appointment: Appointment) => {
    setDraggedAppointment(appointment);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (timeSlot: string, day: string) => {
    if (draggedAppointment) {
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
    }
  };

  const handleDelete = (appointmentId: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== appointmentId));
    toast({
      title: "Appointment deleted",
      description: "The appointment has been removed from the schedule",
    });
  };

  const handleAdd = (timeSlot: string, day: string) => {
    const newAppointment: Appointment = {
      id: Math.random().toString(),
      name: "New Client",
      type: "CrossFit",
      timeSlot,
      day,
    };
    setAppointments([...appointments, newAppointment]);
    setSelectedSlot(null);
    toast({
      title: "Appointment added",
      description: "A new appointment has been added to the schedule",
    });
  };

  const getAppointmentForSlot = (timeSlot: string, day: string) => {
    return appointments.find((apt) => apt.timeSlot === timeSlot && apt.day === day);
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
          <div key={timeSlot} className="grid grid-cols-8 gap-2">
            <div className="text-fitness-text p-2">{timeSlot}</div>
            {days.map((day) => {
              const appointment = getAppointmentForSlot(timeSlot, day);
              return (
                <div
                  key={`${timeSlot}-${day}`}
                  className="bg-fitness-muted rounded-md p-2"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(timeSlot, day)}
                >
                  {appointment ? (
                    <div
                      className="bg-fitness-inner p-2 rounded flex items-center justify-between cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(appointment)}
                    >
                      <Dialog>
                        <DialogTrigger className="flex-1 text-left">
                          <div>
                            <p className="text-fitness-text text-sm">{appointment.name}</p>
                            <p className="text-xs text-gray-400">{appointment.type}</p>
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Appointment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <label className="text-sm font-medium">Client Name</label>
                              <Select defaultValue={appointment.name}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select client" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Heath Graham">Heath Graham</SelectItem>
                                  <SelectItem value="John Doe">John Doe</SelectItem>
                                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Class Type</label>
                              <Select defaultValue={appointment.type}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="CrossFit">CrossFit</SelectItem>
                                  <SelectItem value="Yoga">Yoga</SelectItem>
                                  <SelectItem value="HIIT">HIIT</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <GripVertical className="w-4 h-4 text-gray-400 mr-2" />
                      <Trash2
                        className="w-4 h-4 text-fitness-danger cursor-pointer"
                        onClick={() => handleDelete(appointment.id)}
                      />
                    </div>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full h-full flex items-center justify-center"
                          onClick={() => setSelectedSlot({ timeSlot, day })}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Appointment</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <label className="text-sm font-medium">Client Name</label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select client" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Heath Graham">Heath Graham</SelectItem>
                                <SelectItem value="John Doe">John Doe</SelectItem>
                                <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Class Type</label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CrossFit">CrossFit</SelectItem>
                                <SelectItem value="Yoga">Yoga</SelectItem>
                                <SelectItem value="HIIT">HIIT</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            onClick={() => selectedSlot && handleAdd(selectedSlot.timeSlot, selectedSlot.day)}
                          >
                            Add Appointment
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleGrid;