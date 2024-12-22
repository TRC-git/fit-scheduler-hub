import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Plus } from "lucide-react";
import { TimeSlot } from "@/types/schedule/class-types";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import TimeSlotInputs from "./TimeSlotInputs";

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
  const [copiedFromDay, setCopiedFromDay] = useState<string | null>(null);

  const getSlotsByDay = (day: string) => {
    return timeSlots.filter(slot => slot.day_of_week === day);
  };

  const handleAddSlot = (day: string) => {
    const currentIndex = timeSlots.length;
    onAddSlot();
    setTimeout(() => {
      onUpdateSlot(currentIndex, 'day_of_week', day);
      onUpdateSlot(currentIndex, 'start_time', '09:00');
      onUpdateSlot(currentIndex, 'end_time', '10:00');
    }, 0);
  };

  const copyDaySlots = (fromDay: string) => {
    const slotsFromDay = getSlotsByDay(fromDay);
    if (slotsFromDay.length === 0) {
      toast({
        title: "No slots to copy",
        description: "Add time slots to this day before copying.",
        variant: "destructive",
      });
      return;
    }

    operationalDays
      .filter(day => day !== fromDay)
      .forEach(targetDay => {
        slotsFromDay.forEach(slot => {
          const currentIndex = timeSlots.length;
          onAddSlot();
          setTimeout(() => {
            onUpdateSlot(currentIndex, 'day_of_week', targetDay);
            onUpdateSlot(currentIndex, 'start_time', slot.start_time);
            onUpdateSlot(currentIndex, 'end_time', slot.end_time);
          }, 0);
        });
      });

    setCopiedFromDay(fromDay);
    toast({
      title: "Time slots copied",
      description: "Time slots have been copied to other scheduled days.",
    });
  };

  const getSlotIndex = (slot: TimeSlot) => {
    return timeSlots.findIndex(
      s => s.day_of_week === slot.day_of_week && 
      s.start_time === slot.start_time && 
      s.end_time === slot.end_time
    );
  };

  return (
    <div>
      <Label className="text-fitness-text mb-4 block">Time Slots</Label>
      <div className="space-y-6">
        {operationalDays.map((day) => (
          <div key={day} className="bg-fitness-inner p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-fitness-text font-medium">{day}</h4>
              <div className="flex gap-2">
                {operationalDays[0] === day && (
                  <Button
                    type="button"
                    onClick={() => copyDaySlots(day)}
                    disabled={!!copiedFromDay}
                    className="bg-transparent text-white hover:bg-fitness-inner/20"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Other Days
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => handleAddSlot(day)}
                  className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Time Slot
                </Button>
              </div>
            </div>

            <TimeSlotInputs
              slots={timeSlots}
              day={day}
              onRemoveSlot={onRemoveSlot}
              onUpdateSlot={onUpdateSlot}
              getSlotIndex={getSlotIndex}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;