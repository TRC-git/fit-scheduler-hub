import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ClassType {
  class_type_id: number;
  name: string;
  duration: number;
}

const ClassTypeForm = ({ 
  classType, 
  onSubmit, 
  onCancel 
}: { 
  classType?: ClassType;
  onSubmit: (data: Partial<ClassType>) => Promise<void>;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: classType?.name || "",
    duration: classType?.duration || 60,
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
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-[#15e7fb] text-fitness-text hover:bg-[#15e7fb]/10"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-[#15e7fb] hover:bg-[#15e7fb]/80">
          {classType ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

const ClassTypes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingClassType, setEditingClassType] = useState<ClassType | null>(null);

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
      setEditingClassType(null);
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
          <div key={classType.class_type_id} className="p-4 bg-fitness-inner rounded-md">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingClassType(classType)}
                    >
                      <Pencil className="h-4 w-4 text-[#15e7fb]" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-fitness-card">
                    <DialogHeader>
                      <DialogTitle className="text-fitness-text">Edit Class Type</DialogTitle>
                    </DialogHeader>
                    <ClassTypeForm
                      classType={editingClassType || undefined}
                      onSubmit={(data) =>
                        updateClassTypeMutation.mutateAsync({
                          id: classType.class_type_id,
                          data,
                        })
                      }
                      onCancel={() => setEditingClassType(null)}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteClassTypeMutation.mutate(classType.class_type_id)}
                >
                  <Trash2 className="h-4 w-4 text-fitness-danger" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassTypes;