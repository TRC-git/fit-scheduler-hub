import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { ClassType, CreateClassTypeData, TimeSlot } from "@/types/schedule/class-types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ClassTypeFormProps {
  classType?: ClassType;
  onSubmit: (data: CreateClassTypeData) => Promise<void>;
  onCancel: () => void;
}

const ClassTypeForm = ({ classType, onSubmit, onCancel }: ClassTypeFormProps) => {
  const { toast } = useToast();
  const daysOfWeek = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
  const [formData, setFormData] = useState<CreateClassTypeData>({
    name: classType?.name || "",
    duration: classType?.duration || 60,
    operational_days: classType?.operational_days || [],
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDayToggle = (day: string) => {
    setFormData(prev => {
      const currentDays = prev.operational_days || [];
      const newDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];
      return { ...prev, operational_days: newDays };
    });
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, {
      day_of_week: formData.operational_days?.[0] || daysOfWeek[0],
      start_time: "09:00",
      end_time: "10:00"
    }]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setTimeSlots(updatedSlots);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      
      if (classType?.class_type_id) {
        // Delete existing time slots
        await supabase
          .from('class_time_slots')
          .delete()
          .eq('class_type_id', classType.class_type_id);
      }

      // Insert new time slots
      if (timeSlots.length > 0) {
        const { error } = await supabase
          .from('class_time_slots')
          .insert(
            timeSlots.map(slot => ({
              ...slot,
              class_type_id: classType?.class_type_id
            }))
          );

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Class type ${classType ? 'updated' : 'created'} successfully`,
      });
    } catch (error) {
      console.error('Error saving class type:', error);
      toast({
        title: "Error",
        description: "Failed to save class type",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="text-fitness-text">Class Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-fitness-inner text-fitness-text"
          required
        />
      </div>

      <div>
        <Label className="text-fitness-text">Duration (minutes)</Label>
        <Input
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
          className="bg-fitness-inner text-fitness-text"
          required
        />
      </div>

      <div>
        <Label className="text-fitness-text mb-2 block">Operational Days</Label>
        <div className="flex flex-wrap gap-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center gap-2">
              <Checkbox
                id={day}
                checked={(formData.operational_days || []).includes(day)}
                onCheckedChange={() => handleDayToggle(day)}
                className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
              />
              <Label htmlFor={day} className="text-fitness-text">{day}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-fitness-text">Time Slots</Label>
          <Button
            type="button"
            onClick={addTimeSlot}
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
                onChange={(e) => updateTimeSlot(index, 'day_of_week', e.target.value)}
                className="bg-fitness-card text-fitness-text border border-fitness-muted rounded-md px-2 py-1"
              >
                {formData.operational_days?.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              
              <Input
                type="time"
                value={slot.start_time}
                onChange={(e) => updateTimeSlot(index, 'start_time', e.target.value)}
                className="bg-fitness-card text-fitness-text"
              />
              
              <Input
                type="time"
                value={slot.end_time}
                onChange={(e) => updateTimeSlot(index, 'end_time', e.target.value)}
                className="bg-fitness-card text-fitness-text"
              />
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeTimeSlot(index)}
                className="text-fitness-danger hover:text-fitness-danger/80"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-[#15e7fb] text-fitness-text hover:bg-[#15e7fb]/10"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
          disabled={loading}
        >
          {loading ? 'Saving...' : (classType ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
};

export default ClassTypeForm;