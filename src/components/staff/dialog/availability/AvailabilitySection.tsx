import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeSlotSelector } from "./TimeSlotSelector";
import { AvailabilitySectionProps } from "../types/availability";

export const AvailabilitySection = ({ availability, onChange }: AvailabilitySectionProps) => {
  const days = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

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

  const updateTimeSlot = (index: number, field: keyof typeof availability[0], value: string) => {
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

            <TimeSlotSelector
              value={slot.starttime}
              onChange={(value) => updateTimeSlot(index, "starttime", value)}
              label="Start"
            />

            <TimeSlotSelector
              value={slot.endtime}
              onChange={(value) => updateTimeSlot(index, "endtime", value)}
              label="End"
            />

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