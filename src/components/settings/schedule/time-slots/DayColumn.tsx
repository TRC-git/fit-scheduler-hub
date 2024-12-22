import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TimeSlotItem } from "./TimeSlotItem";

interface DayColumnProps {
  day: string;
  slots: any[];
  classTypes: string[];
  onAddSlot: (day: string) => void;
  onRemoveSlot: (index: number) => void;
  onUpdateSlot: (index: number, field: string, value: any) => void;
}

export const DayColumn = ({
  day,
  slots,
  classTypes,
  onAddSlot,
  onRemoveSlot,
  onUpdateSlot,
}: DayColumnProps) => {
  return (
    <div className="bg-fitness-inner p-4 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-fitness-text font-medium">{day}</h4>
        <Button
          type="button"
          onClick={() => onAddSlot(day)}
          className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Time Slot
        </Button>
      </div>
      
      <div className="space-y-4">
        {slots.map((slot, index) => (
          <TimeSlotItem
            key={`${day}-${index}`}
            slot={slot}
            index={index}
            classTypes={classTypes}
            onRemove={onRemoveSlot}
            onUpdate={onUpdateSlot}
          />
        ))}
      </div>
    </div>
  );
};