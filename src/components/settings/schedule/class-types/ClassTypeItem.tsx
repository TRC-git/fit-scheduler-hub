import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ClassType, UpdateClassTypeData } from "@/types/class-types";
import { Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ClassTypeItemProps {
  classType: ClassType;
  onUpdate: (id: number, data: UpdateClassTypeData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const ClassTypeItem = ({ classType, onUpdate, onDelete }: ClassTypeItemProps) => {
  const [formData, setFormData] = useState<UpdateClassTypeData>({
    name: classType.name,
    duration: classType.duration,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(classType.class_type_id, formData);
  };

  return (
    <div className="p-4 bg-fitness-inner rounded-md">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-fitness-text font-medium">{classType.name}</h4>
          <p className="text-fitness-text/70 text-sm mt-1">
            {classType.duration} min duration
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4 text-[#15e7fb]" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-fitness-card">
              <DialogHeader>
                <DialogTitle className="text-fitness-text">Edit Class Type</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-fitness-text">Class Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-fitness-inner text-fitness-text"
                  />
                </div>
                <div>
                  <Label className="text-fitness-text">Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="bg-fitness-inner text-fitness-text"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="submit" className="bg-[#15e7fb] hover:bg-[#15e7fb]/80">
                    Update
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(classType.class_type_id)}
          >
            <Trash2 className="h-4 w-4 text-fitness-danger" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClassTypeItem;