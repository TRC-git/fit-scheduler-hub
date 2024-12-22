import { Label } from "@/components/ui/label";
import { DayColumn } from "./time-slots/DayColumn";

interface TimeSlotGridProps {
  slots: any[];
  onSlotsChange: (slots: any[]) => void;
}

const TimeSlotGrid = ({ slots, onSlotsChange }: TimeSlotGridProps) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const classTypes = ['CrossFit', 'Yoga', 'HIIT', 'Strength'];

  const addSlot = (day: string) => {
    if (!day) return; // Prevent adding slots without a day
    
    onSlotsChange([...slots, {
      day_of_week: day,
      start_time: '09:00',
      end_time: '10:00',
      class_type: 'CrossFit',
      max_capacity: 20
    }]);
  };

  const removeSlot = (index: number) => {
    const newSlots = [...slots];
    newSlots.splice(index, 1);
    onSlotsChange(newSlots);
  };

  const updateSlot = (index: number, field: string, value: any) => {
    if (field === 'day_of_week' && !value) return; // Prevent updating to null day
    
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    onSlotsChange(newSlots);
  };

  return (
    <div>
      <Label className="text-fitness-text mb-2 block">Time Slots</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {days.map((day) => (
          <DayColumn
            key={day}
            day={day}
            slots={slots.filter(slot => slot.day_of_week === day)}
            classTypes={classTypes}
            onAddSlot={addSlot}
            onRemoveSlot={removeSlot}
            onUpdateSlot={updateSlot}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeSlotGrid;