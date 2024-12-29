import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DaySelector } from "./components/DaySelector";
import { DaySchedule } from "./components/DaySchedule";
import { TimeSlot } from "../types";

interface AvailabilitySectionProps {
  employeeId?: number;
  initialAvailability?: TimeSlot[];
  onAvailabilityChange: (availability: TimeSlot[]) => void;
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
  const [timeSlots, setTimeSlots] = useState<Record<string, TimeSlot[]>>(() => {
    const slots: Record<string, TimeSlot[]> = {};
    initialAvailability.forEach(slot => {
      if (!slots[slot.dayofweek]) {
        slots[slot.dayofweek] = [];
      }
      slots[slot.dayofweek].push({
        starttime: slot.starttime,
        endtime: slot.endtime,
        dayofweek: slot.dayofweek,
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
      [day]: [...(prev[day] || []), { 
        starttime: "09:00", 
        endtime: "17:00", 
        dayofweek: day,
        ispreferred: false 
      }]
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
        .eq('5', employeeId);

      // Insert new availability
      const availabilityData = selectedDays.flatMap(day => 
        timeSlots[day]?.map(slot => ({
          "5": employeeId,
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
      <DaySelector
        days={days}
        selectedDays={selectedDays}
        onDayToggle={handleDayToggle}
      />

      <div className="space-y-6">
        {selectedDays.map((day) => (
          <DaySchedule
            key={day}
            day={day}
            timeSlots={timeSlots[day] || []}
            onAddTimeSlot={() => addTimeSlot(day)}
            onRemoveTimeSlot={(index) => removeTimeSlot(day, index)}
            onUpdateTimeSlot={(index, field, value) => updateTimeSlot(day, index, field, value)}
          />
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
