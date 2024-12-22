import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { TimeSlot } from "@/types/schedule/class-types";

interface TimeSlotsProps {
  timeSlots: TimeSlot[];
  operationalDays: string[];
  onAddSlot: () => void;
  onRemoveSlot: (index: number) => void;
  onUpdateSlot: (index: number, field: keyof TimeSlot, value: string) => void;
}

const TimeSlots = ({ 
  timeSlots, 
  operationalDays, 
  onAddSlot, 
  onRemoveSlot, 
  onUpdateSlot 
}: TimeSlotsProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Label className="text-fitness-text">Time Slots</Label>
        <Button
          type="button"
          onClick={onAddSlot}
          className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Time Slot
        </Button>
      </div>

      <div className="space-y-4">
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex items-center gap-4 bg-fitness-inner p-4 rounded-md">
            <select
              value={slot.day_of_week}
              onChange={(e) => onUpdateSlot(index, 'day_of_week', e.target.value)}
              className="bg-fitness-card text-fitness-text border border-fitness-muted rounded-md px-2 py-1"
            >
              {operationalDays?.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            
            <Input
              type="time"
              value={slot.start_time}
              onChange={(e) => onUpdateSlot(index, 'start_time', e.target.value)}
              className="bg-fitness-card text-fitness-text"
            />
            
            <Input
              type="time"
              value={slot.end_time}
              onChange={(e) => onUpdateSlot(index, 'end_time', e.target.value)}
              className="bg-fitness-card text-fitness-text"
            />
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => onRemoveSlot(index)}
              className="text-fitness-danger hover:text-fitness-danger/80"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;