import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ClassTypeForm from "./ClassTypeForm";
import { CreateClassTypeData } from "@/types/schedule/class-types";

interface ClassTypeDialogProps {
  onSubmit: (data: CreateClassTypeData) => Promise<void>;
}

const ClassTypeDialog = ({ onSubmit }: ClassTypeDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#15e7fb] hover:bg-[#15e7fb]/80">
          <Plus className="w-4 h-4 mr-2" />
          Add Schedule Type
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-fitness-card">
        <DialogHeader>
          <DialogTitle className="text-fitness-text">Create New Schedule Type</DialogTitle>
        </DialogHeader>
        <ClassTypeForm
          onSubmit={onSubmit}
          onCancel={() => {}}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClassTypeDialog;