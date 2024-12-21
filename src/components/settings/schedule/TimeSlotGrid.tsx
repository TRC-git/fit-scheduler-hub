import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface TimeSlotGridProps {
  slots: any[];
  onSlotsChange: (slots: any[]) => void;
}

const TimeSlotGrid = ({ slots, onSlotsChange }: TimeSlotGridProps) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const classTypes = ['CrossFit', 'Yoga', 'HIIT', 'Strength'];

  const addSlot = (day: string) => {
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
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    onSlotsChange(newSlots);
  };

  return (
    <div className="space-y-4">
      <Label className="text-fitness-text">Time Slots</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {days.map((day) => (
          <div key={day} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-fitness-text font-medium">{day}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addSlot(day)}
                className="text-[#15e7fb] hover:text-[#15e7fb]/80"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {slots
                .filter(slot => slot.day_of_week === day)
                .map((slot, index) => (
                  <div key={index} className="bg-fitness-inner p-3 rounded-md space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="time"
                            value={slot.start_time}
                            onChange={(e) => updateSlot(index, 'start_time', e.target.value)}
                            className="bg-fitness-card text-fitness-text"
                          />
                          <Input
                            type="time"
                            value={slot.end_time}
                            onChange={(e) => updateSlot(index, 'end_time', e.target.value)}
                            className="bg-fitness-card text-fitness-text"
                          />
                        </div>
                        
                        <Select
                          value={slot.class_type}
                          onValueChange={(value) => updateSlot(index, 'class_type', value)}
                        >
                          <SelectTrigger className="bg-fitness-card text-fitness-text">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {classTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          type="number"
                          placeholder="Capacity"
                          value={slot.max_capacity}
                          onChange={(e) => updateSlot(index, 'max_capacity', parseInt(e.target.value))}
                          className="bg-fitness-card text-fitness-text"
                        />
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSlot(index)}
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

export default TimeSlotGrid;