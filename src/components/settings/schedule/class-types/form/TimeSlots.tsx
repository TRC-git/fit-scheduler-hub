import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Copy } from "lucide-react";
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
  const copyToAllDays = (sourceSlot: TimeSlot) => {
    const sourceIndex = timeSlots.indexOf(sourceSlot);
    if (sourceIndex === -1) return;

    operationalDays.forEach(day => {
      if (day !== sourceSlot.day_of_week) {
        const newSlot = {
          ...sourceSlot,
          day_of_week: day
        };
        onAddSlot();
        const newIndex = timeSlots.length;
        onUpdateSlot(newIndex, 'day_of_week', day);
        onUpdateSlot(newIndex, 'start_time', sourceSlot.start_time);
        onUpdateSlot(newIndex, 'end_time', sourceSlot.end_time);
      }
    });
  };

  const groupedSlots = operationalDays.reduce((acc, day) => {
    acc[day] = timeSlots.filter(slot => slot.day_of_week === day);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Label className="text-fitness-text">Time Slots</Label>
      </div>

      <div className="space-y-6">
        {operationalDays.map((day) => (
          <div key={day} className="bg-fitness-inner p-4 rounded-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-fitness-text font-medium">{day}</h4>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    onAddSlot();
                    const newIndex = timeSlots.length;
                    onUpdateSlot(newIndex, 'day_of_week', day);
                    onUpdateSlot(newIndex, 'start_time', '09:00');
                    onUpdateSlot(newIndex, 'end_time', '10:00');
                  }}
                  className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Time Slot
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {groupedSlots[day]?.map((slot, index) => (
                <div key={index} className="flex items-center gap-4 bg-fitness-card p-4 rounded-md">
                  <Input
                    type="time"
                    value={slot.start_time}
                    onChange={(e) => onUpdateSlot(timeSlots.indexOf(slot), 'start_time', e.target.value)}
                    className="bg-fitness-muted text-fitness-text"
                  />
                  
                  <Input
                    type="time"
                    value={slot.end_time}
                    onChange={(e) => onUpdateSlot(timeSlots.indexOf(slot), 'end_time', e.target.value)}
                    className="bg-fitness-muted text-fitness-text"
                  />
                  
                  <div className="flex gap-2">
                    {index === 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => copyToAllDays(slot)}
                        className="border-[#15e7fb] text-fitness-text hover:bg-[#15e7fb]/10"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onRemoveSlot(timeSlots.indexOf(slot))}
                      className="text-fitness-danger hover:text-fitness-danger/80"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;