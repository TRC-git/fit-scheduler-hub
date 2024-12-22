import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ClassType, CreateClassTypeData, TimeSlot } from "@/types/schedule/class-types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import BasicDetails from "./form/BasicDetails";
import OperationalDays from "./form/OperationalDays";
import TimeSlots from "./form/TimeSlots";

interface ClassTypeFormProps {
  classType?: ClassType;
  onSubmit: (data: CreateClassTypeData) => Promise<void>;
  onCancel: () => void;
}

const ClassTypeForm = ({ classType, onSubmit, onCancel }: ClassTypeFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateClassTypeData>({
    name: classType?.name || "",
    duration: classType?.duration || 60,
    operational_days: classType?.operational_days || [],
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
      day_of_week: formData.operational_days?.[0] || "Mon",
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
        await supabase
          .from('class_time_slots')
          .delete()
          .eq('class_type_id', classType.class_type_id);
      }

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
        description: `Schedule type ${classType ? 'updated' : 'created'} successfully`,
      });
    } catch (error) {
      console.error('Error saving schedule type:', error);
      toast({
        title: "Error",
        description: "Failed to save schedule type",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BasicDetails
        name={formData.name}
        duration={formData.duration}
        onChange={handleFieldChange}
      />

      <OperationalDays
        selectedDays={formData.operational_days || []}
        onDayToggle={handleDayToggle}
      />

      <TimeSlots
        timeSlots={timeSlots}
        operationalDays={formData.operational_days || []}
        onAddSlot={addTimeSlot}
        onRemoveSlot={removeTimeSlot}
        onUpdateSlot={updateTimeSlot}
      />

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