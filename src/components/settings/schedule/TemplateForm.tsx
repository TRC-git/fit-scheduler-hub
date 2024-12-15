import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import TimeSlotGrid from "./TimeSlotGrid";

interface TemplateFormProps {
  template?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const TemplateForm = ({ template, onSubmit, onCancel }: TemplateFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    template_name: template?.template_name || "",
    recurring_pattern: template?.recurring_pattern || "",
  });

  const [slots, setSlots] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const templateResult = await onSubmit(formData);
      
      if (slots.length > 0 && templateResult?.scheduleid) {
        const { error } = await supabase
          .from('template_slots')
          .insert(
            slots.map(slot => ({
              template_id: templateResult.scheduleid,
              ...slot
            }))
          );

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Template and slots saved successfully",
      });
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="text-fitness-text">Template Name</Label>
        <Input 
          className="bg-fitness-inner text-fitness-text"
          value={formData.template_name}
          onChange={(e) => setFormData({...formData, template_name: e.target.value})}
        />
      </div>
      
      <div>
        <Label className="text-fitness-text">Recurring Pattern</Label>
        <Select 
          value={formData.recurring_pattern}
          onValueChange={(value) => setFormData({...formData, recurring_pattern: value})}
        >
          <SelectTrigger className="bg-fitness-inner text-fitness-text">
            <SelectValue placeholder="Select pattern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="biweekly">Bi-weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TimeSlotGrid 
        slots={slots}
        onSlotsChange={setSlots}
      />

      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-[#15e7fb] text-fitness-text hover:bg-[#15e7fb]/10"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
        >
          {template ? 'Update' : 'Create'} Template
        </Button>
      </div>
    </form>
  );
};

export default TemplateForm;