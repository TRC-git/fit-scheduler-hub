import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSlot {
  dayofweek: string;
  starttime: string;
  endtime: string;
  ispreferred?: boolean;
}

interface AvailabilitySectionProps {
  availability: TimeSlot[];
  onChange: (availability: TimeSlot[]) => void;
}

export const AvailabilitySection = ({ availability, onChange }: AvailabilitySectionProps) => {
  const days = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const addTimeSlot = () => {
    onChange([
      ...availability,
      { dayofweek: "Mon", starttime: "09:00", endtime: "17:00" },
    ]);
  };

  const removeTimeSlot = (index: number) => {
    const newAvailability = [...availability];
    newAvailability.splice(index, 1);
    onChange(newAvailability);
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const newAvailability = [...availability];
    newAvailability[index] = {
      ...newAvailability[index],
      [field]: value,
    };
    onChange(newAvailability);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-fitness-text">Availability</Label>
        <Button
          type="button"
          onClick={addTimeSlot}
          variant="outline"
          size="sm"
          className="text-[#15e7fb] border-[#15e7fb]"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Time Slot
        </Button>
      </div>

      <div className="space-y-3">
        {availability.map((slot, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-3 bg-fitness-inner rounded-md"
          >
            <Select
              value={slot.dayofweek}
              onValueChange={(value) => updateTimeSlot(index, "dayofweek", value)}
            >
              <SelectTrigger className="w-[100px] bg-fitness-card">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent className="bg-fitness-card border-fitness-muted">
                {days.map((day) => (
                  <SelectItem
                    key={day}
                    value={day}
                    className="text-fitness-text hover:bg-[#15e7fb] hover:text-[#333333]"
                  >
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={slot.starttime}
              onValueChange={(value) => updateTimeSlot(index, "starttime", value)}
            >
              <SelectTrigger className="w-[100px] bg-fitness-card">
                <SelectValue placeholder="Start" />
              </SelectTrigger>
              <SelectContent className="bg-fitness-card border-fitness-muted">
                {timeSlots.map((time) => (
                  <SelectItem
                    key={time}
                    value={time}
                    className="text-fitness-text hover:bg-[#15e7fb] hover:text-[#333333]"
                  >
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={slot.endtime}
              onValueChange={(value) => updateTimeSlot(index, "endtime", value)}
            >
              <SelectTrigger className="w-[100px] bg-fitness-card">
                <SelectValue placeholder="End" />
              </SelectTrigger>
              <SelectContent className="bg-fitness-card border-fitness-muted">
                {timeSlots.map((time) => (
                  <SelectItem
                    key={time}
                    value={time}
                    className="text-fitness-text hover:bg-[#15e7fb] hover:text-[#333333]"
                  >
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeTimeSlot(index)}
              className="ml-auto text-red-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};