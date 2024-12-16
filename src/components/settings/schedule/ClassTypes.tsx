import { useClassTypes } from "@/hooks/schedule/useClassTypes";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import ClassTypeForm from "./class-types/ClassTypeForm";
import ClassTypesList from "./class-types/ClassTypesList";

const ClassTypes = () => {
  const { 
    classTypes, 
    createClassType, 
    updateClassType, 
    deleteClassType 
  } = useClassTypes();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-fitness-text">Class Types</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#15e7fb] hover:bg-[#15e7fb]/80">
              <Plus className="w-4 h-4 mr-2" />
              Add Class Type
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-fitness-card">
            <DialogHeader>
              <DialogTitle className="text-fitness-text">Create New Class Type</DialogTitle>
            </DialogHeader>
            <ClassTypeForm
              onSubmit={(data) => createClassType.mutateAsync(data)}
              onCancel={() => {}}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ClassTypesList
        classTypes={classTypes || []}
        onUpdate={(id, data) => updateClassType.mutateAsync({ id, data })}
        onDelete={(id) => deleteClassType.mutateAsync(id)}
      />
    </div>
  );
};

export default ClassTypes;