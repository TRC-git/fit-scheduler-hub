import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { TimeSlot } from "@/types/schedule/class-types";

interface TimeSlotInputsProps {
  slots: TimeSlot[];
  day: string;
  onRemoveSlot: (index: number) => void;
  onUpdateSlot: (index: number, field: keyof TimeSlot, value: string) => void;
  getSlotIndex: (slot: TimeSlot) => number;
}

const TimeSlotInputs = ({ slots, day, onRemoveSlot, onUpdateSlot, getSlotIndex }: TimeSlotInputsProps) => {
  return (
    <div className="space-y-4">
      {slots.filter(slot => slot.day_of_week === day).map((slot, slotIndex) => {
        const globalIndex = getSlotIndex(slot);
        
        return (
          <div key={slotIndex} className="flex items-center gap-4 bg-fitness-card p-4 rounded-md">
            <Input
              type="time"
              value={slot.start_time}
              onChange={(e) => onUpdateSlot(globalIndex, 'start_time', e.target.value)}
              className="bg-fitness-background text-fitness-text"
            />
            <span className="text-fitness-text">to</span>
            <Input
              type="time"
              value={slot.end_time}
              onChange={(e) => onUpdateSlot(globalIndex, 'end_time', e.target.value)}
              className="bg-fitness-background text-fitness-text"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => onRemoveSlot(globalIndex)}
              className="text-fitness-danger hover:text-fitness-danger/80"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default TimeSlotInputs;