import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ClassType, CreateClassTypeData, TimeSlot } from "@/types/schedule/class-types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

  useEffect(() => {
    if (classType?.class_type_id) {
      loadTimeSlots();
    }
  }, [classType?.class_type_id]);

  const loadTimeSlots = async () => {
    if (!classType?.class_type_id) return;

    try {
      const { data, error } = await supabase
        .from('class_time_slots')
        .select('*')
        .eq('class_type_id', classType.class_type_id);

      if (error) throw error;
      if (data) setTimeSlots(data);
    } catch (error) {
      console.error('Error loading time slots:', error);
      toast({
        title: "Error",
        description: "Failed to load time slots",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (formData.operational_days && formData.operational_days.length > 0) {
      const existingDays = new Set(timeSlots.map(slot => slot.day_of_week));
      const newDays = formData.operational_days.filter(day => !existingDays.has(day));
      
      if (newDays.length > 0) {
        const initialSlots = newDays.map(day => ({
          day_of_week: day,
          start_time: "09:00",
          end_time: "10:00"
        }));
        setTimeSlots(prev => [...prev, ...initialSlots]);
      }
    }
  }, [formData.operational_days]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => {
      const currentDays = prev.operational_days || [];
      const newDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];
      
      if (!currentDays.includes(day)) {
        setTimeSlots(prev => [...prev, {
          day_of_week: day,
          start_time: "09:00",
          end_time: "10:00"
        }]);
      } else {
        setTimeSlots(prev => prev.filter(slot => slot.day_of_week !== day));
      }
      
      return { ...prev, operational_days: newDays };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // First submit the class type data
      await onSubmit(formData);
      
      // Get the class type ID (either existing or newly created)
      let classTypeId = classType?.class_type_id;
      if (!classTypeId) {
        const { data: newClassType } = await supabase
          .from('class_types')
          .select('class_type_id')
          .eq('name', formData.name)
          .maybeSingle();
        classTypeId = newClassType?.class_type_id;
      }

      if (classTypeId) {
        // Delete existing time slots
        await supabase
          .from('class_time_slots')
          .delete()
          .eq('class_type_id', classTypeId);

        // Insert new time slots with proper slot_id handling
        if (timeSlots.length > 0) {
          const { error: insertError } = await supabase
            .from('class_time_slots')
            .insert(
              timeSlots.map(slot => ({
                class_type_id: classTypeId,
                day_of_week: slot.day_of_week,
                start_time: slot.start_time,
                end_time: slot.end_time
              }))
            );

          if (insertError) throw insertError;
        }
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
        onAddSlot={(day) => {
          setTimeSlots(prev => [...prev, {
            day_of_week: day,
            start_time: "09:00",
            end_time: "10:00"
          }]);
        }}
        onRemoveSlot={(index) => {
          setTimeSlots(prev => prev.filter((_, i) => i !== index));
        }}
        onUpdateSlot={(index, field, value) => {
          setTimeSlots(prev => {
            const newSlots = [...prev];
            newSlots[index] = { ...newSlots[index], [field]: value };
            return newSlots;
          });
        }}
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