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
  const addTimeSlotForDay = (day: string) => {
    const newSlot: TimeSlot = {
      day_of_week: day,
      start_time: '09:00',
      end_time: '10:00'
    };
    onAddSlot();
    const newIndex = timeSlots.length;
    onUpdateSlot(newIndex, 'day_of_week', newSlot.day_of_week);
    onUpdateSlot(newIndex, 'start_time', newSlot.start_time);
    onUpdateSlot(newIndex, 'end_time', newSlot.end_time);
  };

  // Group time slots by day
  const groupedSlots = operationalDays.reduce((acc, day) => {
    acc[day] = timeSlots.filter(slot => slot.day_of_week === day);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div>
      <Label className="text-fitness-text mb-2 block">Time Slots</Label>
      <div className="space-y-6">
        {operationalDays.map((day) => (
          <div key={day} className="bg-fitness-inner p-4 rounded-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-fitness-text font-medium">{day}</h4>
              <Button
                type="button"
                onClick={() => addTimeSlotForDay(day)}
                className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Time Slot
              </Button>
            </div>
            
            <div className="space-y-4">
              {groupedSlots[day]?.map((slot, index) => {
                const globalIndex = timeSlots.findIndex(
                  s => s.day_of_week === slot.day_of_week && 
                  s.start_time === slot.start_time && 
                  s.end_time === slot.end_time
                );
                return (
                  <div key={`${day}-${index}`} className="flex items-center gap-4 bg-fitness-card p-4 rounded-md">
                    <Input
                      type="time"
                      value={slot.start_time}
                      onChange={(e) => onUpdateSlot(globalIndex, 'start_time', e.target.value)}
                      className="bg-fitness-muted text-fitness-text"
                    />
                    
                    <Input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) => onUpdateSlot(globalIndex, 'end_time', e.target.value)}
                      className="bg-fitness-muted text-fitness-text"
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;