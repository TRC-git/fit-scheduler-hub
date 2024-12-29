import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TimeSlot } from "../types";
import { TimeSlotItem } from "./TimeSlotItem";

interface DayScheduleProps {
  day: string;
  timeSlots: TimeSlot[];
  onAddTimeSlot: () => void;
  onRemoveTimeSlot: (index: number) => void;
  onUpdateTimeSlot: (index: number, field: keyof TimeSlot, value: any) => void;
}

export const DaySchedule = ({
  day,
  timeSlots,
  onAddTimeSlot,
  onRemoveTimeSlot,
  onUpdateTimeSlot,
}: DayScheduleProps) => {
  return (
    <div className="bg-fitness-inner p-4 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-fitness-text font-medium">{day}</h4>
        <Button
          type="button"
          onClick={onAddTimeSlot}
          className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Time Slot
        </Button>
      </div>
      
      <div className="space-y-4">
        {timeSlots.map((slot, index) => (
          <TimeSlotItem
            key={index}
            slot={slot}
            index={index}
            onRemove={() => onRemoveTimeSlot(index)}
            onUpdate={(field, value) => onUpdateTimeSlot(index, field, value)}
          />
        ))}
      </div>
    </div>
  );
};