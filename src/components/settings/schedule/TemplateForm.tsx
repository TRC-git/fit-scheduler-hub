import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface TemplateFormProps {
  template?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const TemplateForm = ({ template, onSubmit, onCancel }: TemplateFormProps) => {
  const [formData, setFormData] = useState({
    template_name: template?.template_name || "",
    recurring_pattern: template?.recurring_pattern || "",
    starttime: template?.starttime || "09:00",
    endtime: template?.endtime || "17:00"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Input 
          className="bg-fitness-inner text-fitness-text"
          value={formData.recurring_pattern}
          onChange={(e) => setFormData({...formData, recurring_pattern: e.target.value})}
          placeholder="e.g., Weekly on Monday"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-fitness-text">Start Time</Label>
          <Input 
            type="time"
            className="bg-fitness-inner text-fitness-text"
            value={formData.starttime}
            onChange={(e) => setFormData({...formData, starttime: e.target.value})}
          />
        </div>
        <div>
          <Label className="text-fitness-text">End Time</Label>
          <Input 
            type="time"
            className="bg-fitness-inner text-fitness-text"
            value={formData.endtime}
            onChange={(e) => setFormData({...formData, endtime: e.target.value})}
          />
        </div>
      </div>
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