import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import TemplateForm from "./TemplateForm";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TemplateListProps {
  templates: any[];
}

const TemplateList = ({ templates }: TemplateListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const updateTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      const { data, error } = await supabase
        .from('schedules')
        .update(templateData)
        .eq('scheduleid', templateData.scheduleid);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleTemplates'] });
      setEditingTemplate(null);
      toast({
        title: "Success",
        description: "Schedule template updated successfully",
      });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: number) => {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('scheduleid', templateId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleTemplates'] });
      toast({
        title: "Success",
        description: "Schedule template deleted successfully",
      });
    },
  });

  return (
    <div className="grid gap-4">
      {templates?.map((template: any) => (
        <div key={template.scheduleid} className="p-4 bg-fitness-inner rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-fitness-text font-medium">{template.template_name}</h4>
              <p className="text-fitness-text/70 text-sm mt-1">
                {template.recurring_pattern || 'No recurring pattern'}
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setEditingTemplate(template)}
                  >
                    <Pencil className="h-4 w-4 text-[#15e7fb]" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-fitness-card">
                  <DialogHeader>
                    <DialogTitle className="text-fitness-text">Edit Template</DialogTitle>
                  </DialogHeader>
                  <TemplateForm 
                    template={editingTemplate}
                    onSubmit={(data) => updateTemplateMutation.mutate({
                      ...data,
                      scheduleid: template.scheduleid
                    })}
                    onCancel={() => setEditingTemplate(null)}
                  />
                </DialogContent>
              </Dialog>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => deleteTemplateMutation.mutate(template.scheduleid)}
              >
                <Trash2 className="h-4 w-4 text-fitness-danger" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateList;