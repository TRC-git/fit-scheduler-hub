import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ClassType, UpdateClassTypeData } from "@/types/schedule/class-types";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import ClassTypeForm from "./ClassTypeForm";

interface ClassTypeItemProps {
  classType: ClassType;
  onUpdate: (id: number, data: UpdateClassTypeData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const ClassTypeItem = ({ classType, onUpdate, onDelete }: ClassTypeItemProps) => {
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
              <ClassTypeForm
                classType={classType}
                onSubmit={(data) => onUpdate(classType.class_type_id, data)}
                onCancel={() => {}}
              />
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