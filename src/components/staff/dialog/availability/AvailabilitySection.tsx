import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TimeSlotSelector } from "./TimeSlotSelector";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TimeSlot {
  starttime: string;
  endtime: string;
  ispreferred?: boolean;
}

interface DaySlots {
  [key: string]: TimeSlot[];
}

interface AvailabilitySectionProps {
  employeeId?: number;
  initialAvailability?: any[];
  onAvailabilityChange: (availability: any[]) => void;
}

export const AvailabilitySection = ({ 
  employeeId,
  initialAvailability = [],
  onAvailabilityChange 
}: AvailabilitySectionProps) => {
  const { toast } = useToast();
  const days = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
  const [selectedDays, setSelectedDays] = useState<string[]>(
    Array.from(new Set(initialAvailability.map(slot => slot.dayofweek)))
  );
  const [timeSlots, setTimeSlots] = useState<DaySlots>(() => {
    const slots: DaySlots = {};
    initialAvailability.forEach(slot => {
      if (!slots[slot.dayofweek]) {
        slots[slot.dayofweek] = [];
      }
      slots[slot.dayofweek].push({
        starttime: slot.starttime,
        endtime: slot.endtime,
        ispreferred: slot.ispreferred
      });
    });
    return slots;
  });

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        const newDays = prev.filter(d => d !== day);
        const newSlots = { ...timeSlots };
        delete newSlots[day];
        setTimeSlots(newSlots);
        return newDays;
      }
      return [...prev, day];
    });
  };

  const addTimeSlot = (day: string) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), { starttime: "09:00", endtime: "17:00", ispreferred: false }]
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (day: string, index: number, field: keyof TimeSlot, value: any) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: prev[day].map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const handleSave = async () => {
    if (!employeeId) return;

    try {
      // Delete existing availability
      await supabase
        .from('employeeavailability')
        .delete()
        .eq('employeeid', employeeId);

      // Insert new availability
      const availabilityData = selectedDays.flatMap(day => 
        timeSlots[day]?.map(slot => ({
          employeeid: employeeId,
          dayofweek: day,
          starttime: slot.starttime,
          endtime: slot.endtime,
          ispreferred: slot.ispreferred
        })) || []
      );

      if (availabilityData.length > 0) {
        const { error } = await supabase
          .from('employeeavailability')
          .insert(availabilityData);

        if (error) throw error;
      }

      onAvailabilityChange(availabilityData);
      toast({
        title: "Success",
        description: "Availability has been updated successfully",
      });
    } catch (error) {
      console.error('Error saving availability:', error);
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-fitness-text mb-2 block">Schedule Days</Label>
        <div className="flex flex-wrap gap-4 mb-4">
          {days.map((day) => (
            <div key={day} className="flex items-center gap-2">
              <Checkbox
                id={day}
                checked={selectedDays.includes(day)}
                onCheckedChange={() => handleDayToggle(day)}
                className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
              />
              <Label htmlFor={day} className="text-fitness-text">{day}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {selectedDays.map((day) => (
          <div key={day} className="bg-fitness-inner p-4 rounded-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-fitness-text font-medium">{day}</h4>
              <Button
                type="button"
                onClick={() => addTimeSlot(day)}
                className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Time Slot
              </Button>
            </div>
            
            <div className="space-y-4">
              {timeSlots[day]?.map((slot, index) => (
                <div key={index} className="flex items-center gap-4 bg-fitness-card p-4 rounded-md">
                  <TimeSlotSelector
                    value={slot.starttime}
                    onChange={(value) => updateTimeSlot(day, index, 'starttime', value)}
                    label="Start Time"
                  />
                  
                  <TimeSlotSelector
                    value={slot.endtime}
                    onChange={(value) => updateTimeSlot(day, index, 'endtime', value)}
                    label="End Time"
                  />
                  
                  <Checkbox
                    checked={slot.ispreferred}
                    onCheckedChange={(checked) => 
                      updateTimeSlot(day, index, 'ispreferred', checked)
                    }
                    className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                  />
                  <Label className="text-fitness-text">Preferred</Label>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeTimeSlot(day, index)}
                    className="ml-auto text-red-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button 
        onClick={handleSave}
        className="w-full bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
      >
        Save Availability
      </Button>
    </div>
  );
};