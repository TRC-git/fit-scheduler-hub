import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClassType } from "@/types/class-types";
import ClassTypeForm from "./class-types/ClassTypeForm";
import ClassTypeItem from "./class-types/ClassTypeItem";

const ClassTypes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: classTypes } = useQuery({
    queryKey: ['classTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('class_types')
        .select('*');
      
      if (error) throw error;
      return data as ClassType[];
    }
  });

  const createClassTypeMutation = useMutation({
    mutationFn: async (classTypeData: Partial<ClassType>) => {
      const { error } = await supabase
        .from('class_types')
        .insert([classTypeData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classTypes'] });
      toast({
        title: "Success",
        description: "Class type created successfully",
      });
    },
  });

  const updateClassTypeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ClassType> }) => {
      const { error } = await supabase
        .from('class_types')
        .update(data)
        .eq('class_type_id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classTypes'] });
      toast({
        title: "Success",
        description: "Class type updated successfully",
      });
    },
  });

  const deleteClassTypeMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('class_types')
        .delete()
        .eq('class_type_id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classTypes'] });
      toast({
        title: "Success",
        description: "Class type deleted successfully",
      });
    },
  });

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
              onSubmit={(data) => createClassTypeMutation.mutateAsync(data)}
              onCancel={() => {}}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {classTypes?.map((classType) => (
          <ClassTypeItem
            key={classType.class_type_id}
            classType={classType}
            onUpdate={(id, data) => updateClassTypeMutation.mutateAsync({ id, data })}
            onDelete={(id) => deleteClassTypeMutation.mutateAsync(id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ClassTypes;