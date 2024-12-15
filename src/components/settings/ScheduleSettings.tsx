import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DaysOfOperation from "./schedule/DaysOfOperation";
import OperatingHours from "./schedule/OperatingHours";
import ClassTypes from "./schedule/ClassTypes";
import TemplateList from "./schedule/TemplateList";
import TemplateForm from "./schedule/TemplateForm";

const ScheduleSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates } = useQuery({
    queryKey: ['scheduleTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('is_template', true);
      
      if (error) throw error;
      return data;
    }
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      const { data, error } = await supabase
        .from('schedules')
        .insert([{ ...templateData, is_template: true }]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduleTemplates'] });
      toast({
        title: "Success",
        description: "Schedule template created successfully",
      });
    },
  });

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Schedule Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DaysOfOperation />
        <OperatingHours />
        <ClassTypes />
        
        <div>
          <h3 className="text-fitness-text mb-4">Schedule Templates</h3>
          <TemplateList templates={templates || []} />
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Template
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-fitness-card">
              <DialogHeader>
                <DialogTitle className="text-fitness-text">Create New Template</DialogTitle>
              </DialogHeader>
              <TemplateForm 
                onSubmit={(data) => createTemplateMutation.mutate(data)}
                onCancel={() => {}}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleSettings;