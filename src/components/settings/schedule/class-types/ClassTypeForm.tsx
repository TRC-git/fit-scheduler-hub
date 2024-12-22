import { useState, useEffect } from "react";
import { ClassType, CreateClassTypeData } from "@/types/schedule/class-types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTimeSlots } from "@/hooks/useTimeSlots";
import BasicDetails from "./form/BasicDetails";
import OperationalDays from "./form/OperationalDays";
import TimeSlots from "./form/TimeSlots";
import { Button } from "@/components/ui/button";

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
  const [loading, setLoading] = useState(false);
  
  const {
    timeSlots,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    handleDayToggle
  } = useTimeSlots(classType?.class_type_id);

  useEffect(() => {
    if (formData.operational_days && formData.operational_days.length > 0) {
      const existingDays = new Set(timeSlots.map(slot => slot.day_of_week));
      const newDays = formData.operational_days.filter(day => !existingDays.has(day));
      
      if (newDays.length > 0) {
        newDays.forEach(day => addTimeSlot(day));
      }
    }
  }, [formData.operational_days]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDayToggleWrapper = (day: string) => {
    setFormData(prev => {
      const currentDays = prev.operational_days || [];
      const newDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];
      
      handleDayToggle(day, currentDays);
      return { ...prev, operational_days: newDays };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First submit the class type data
      await onSubmit(formData);
      
      // Get the class type ID
      const { data: newClassType, error: classTypeError } = await supabase
        .from('class_types')
        .select('class_type_id')
        .eq('name', formData.name)
        .maybeSingle();
        
      if (classTypeError) throw classTypeError;
      
      const classTypeId = classType?.class_type_id || newClassType?.class_type_id;
      
      if (classTypeId) {
        // Delete existing slots
        const { error: deleteError } = await supabase
          .from('class_time_slots')
          .delete()
          .eq('class_type_id', classTypeId);
          
        if (deleteError) throw deleteError;

        // Insert new slots if there are any
        if (timeSlots.length > 0) {
          const slotsToInsert = timeSlots.map(slot => ({
            class_type_id: classTypeId,
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: slot.end_time
          }));

          const { error: insertError } = await supabase
            .from('class_time_slots')
            .insert(slotsToInsert);

          if (insertError) throw insertError;
        }
      }

      toast({
        title: "Success",
        description: `Schedule type ${classType ? 'updated' : 'created'} successfully`,
      });
      
      onCancel(); // Close the form after successful save
      
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
        onDayToggle={handleDayToggleWrapper}
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