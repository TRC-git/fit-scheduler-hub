import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateClassTypeData } from "@/types/schedule/class-types";

interface ClassTypeFormProps {
  onSubmit: (data: CreateClassTypeData) => Promise<void>;
  onCancel: () => void;
}

const ClassTypeForm = ({ onSubmit, onCancel }: ClassTypeFormProps) => {
  const [formData, setFormData] = useState<CreateClassTypeData>({
    name: "",
    duration: 60,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          min={1}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#15e7fb] hover:bg-[#15e7fb]/80">
          Create
        </Button>
      </div>
    </form>
  );
};

export default ClassTypeForm;