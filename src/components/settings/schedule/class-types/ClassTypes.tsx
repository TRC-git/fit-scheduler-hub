import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useClassTypes } from "@/hooks/useClassTypes";
import ClassTypeForm from "./ClassTypeForm";
import ClassTypesList from "./ClassTypesList";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <h3 className="text-fitness-text">Schedule Types</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#15e7fb] hover:bg-[#15e7fb]/80">
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule Type
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-fitness-card max-h-[90vh] w-[calc(100%+100px)] max-w-[calc(32rem+100px)]">
            <DialogHeader>
              <DialogTitle className="text-fitness-text">Create New Schedule Type</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(90vh-8rem)] pr-4" style={{
              '--scrollbar-thumb': '#15e7fb',
              '--scrollbar-track': 'transparent'
            } as React.CSSProperties}>
              <ClassTypeForm
                onSubmit={(data) => createClassType.mutateAsync(data)}
                onCancel={() => {}}
              />
            </ScrollArea>
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