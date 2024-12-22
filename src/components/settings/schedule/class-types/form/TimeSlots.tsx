import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Plus, X } from "lucide-react";
import { TimeSlot } from "@/types/schedule/class-types";
import { toast } from "@/hooks/use-toast";

interface TimeSlotsProps {
  timeSlots: TimeSlot[];
  operationalDays: string[];
  onAddSlot: (day: string) => void;
  onRemoveSlot: (index: number) => void;
  onUpdateSlot: (index: number, field: string, value: any) => void;
}

export const TimeSlots = ({ 
  timeSlots, 
  operationalDays,
  onAddSlot, 
  onRemoveSlot, 
  onUpdateSlot 
}: TimeSlotsProps) => {
  const dayOrder = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
  
  const sortedOperationalDays = [...operationalDays].sort(
    (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
  );

  const getTimeSlotsByDay = (day: string) => {
    return timeSlots
      .map((slot, index) => ({ ...slot, index }))
      .filter(slot => slot.day_of_week === day);
  };

  const handleCopyToAll = (sourceDay: string) => {
    const sourceDaySlots = getTimeSlotsByDay(sourceDay);
    
    if (!sourceDaySlots?.length) {
      toast({
        title: "No slots to copy",
        description: "Add time slots to the first day before copying.",
        variant: "destructive"
      });
      return;
    }

    // Get target days (all operational days except the source day)
    const targetDays = sortedOperationalDays.filter(day => day !== sourceDay);

    // For each target day
    targetDays.forEach(targetDay => {
      // Remove existing slots for the target day (from last to first to maintain correct indices)
      const existingSlots = timeSlots
        .map((slot, index) => ({ slot, index }))
        .filter(({ slot }) => slot.day_of_week === targetDay)
        .sort((a, b) => b.index - a.index);

      existingSlots.forEach(({ index }) => {
        onRemoveSlot(index);
      });
    });

    // Now add new slots for each target day
    targetDays.forEach(targetDay => {
      sourceDaySlots.forEach(sourceSlot => {
        onAddSlot(targetDay);
        const newSlotIndex = timeSlots.length;
        onUpdateSlot(newSlotIndex, 'start_time', sourceSlot.start_time);
        onUpdateSlot(newSlotIndex, 'end_time', sourceSlot.end_time);
      });
    });

    toast({
      title: "Success",
      description: "Time slots copied to all operational days",
    });
  };

  return (
    <div>
      <Label className="text-fitness-text mb-2 block">Time Slots</Label>
      <div className="space-y-6">
        {sortedOperationalDays.map((day, dayIndex) => {
          const daySlots = getTimeSlotsByDay(day);
          
          return (
            <div key={day} className="bg-fitness-inner p-4 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h4 className="text-fitness-text font-medium">{day}</h4>
                  {dayIndex === 0 && daySlots.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleCopyToAll(day)}
                      className="text-[#868686] hover:text-[#868686]/80 hover:bg-transparent"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to All
                    </Button>
                  )}
                </div>
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
                {daySlots.map(({ index, start_time, end_time }) => (
                  <div key={index} className="flex items-center gap-4 bg-fitness-card p-4 rounded-md">
                    <Input
                      type="time"
                      value={start_time}
                      onChange={(e) => onUpdateSlot(index, 'start_time', e.target.value)}
                      className="bg-fitness-muted text-fitness-text"
                    />
                    
                    <Input
                      type="time"
                      value={end_time}
                      onChange={(e) => onUpdateSlot(index, 'end_time', e.target.value)}
                      className="bg-fitness-muted text-fitness-text"
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
        })}
      </div>
    </div>
  );
};

export default TimeSlots;