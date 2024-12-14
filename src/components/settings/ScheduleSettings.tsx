import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ScheduleSettings = () => {
  const { toast } = useToast();
  const daysOfWeek = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

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
        <div>
          <h3 className="text-fitness-text mb-4">Days of Operation</h3>
          <div className="flex gap-4 flex-wrap">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center gap-2">
                <Checkbox 
                  id={day}
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor={day} className="text-fitness-text">{day}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-fitness-text mb-4">Operating Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-fitness-text">Opening Time</Label>
              <Input type="time" className="bg-fitness-inner text-fitness-text" />
            </div>
            <div>
              <Label className="text-fitness-text">Closing Time</Label>
              <Input type="time" className="bg-fitness-inner text-fitness-text" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-fitness-text mb-4">Schedule Templates</h3>
          <div className="grid gap-4">
            {templates?.map((template: any) => (
              <div key={template.scheduleid} className="p-4 bg-fitness-inner rounded-md">
                <h4 className="text-fitness-text font-medium">{template.template_name}</h4>
                <p className="text-fitness-text/70 text-sm mt-1">
                  {template.recurring_pattern || 'No recurring pattern'}
                </p>
              </div>
            ))}
            <Button 
              className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
              onClick={() => createTemplateMutation.mutate({
                template_name: "New Template",
                shiftdate: new Date().toISOString(),
                starttime: "09:00",
                endtime: "17:00"
              })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleSettings;