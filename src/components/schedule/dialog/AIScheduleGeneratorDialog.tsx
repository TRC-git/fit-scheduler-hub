import { DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "./DialogHeader";
import { DialogActions } from "./DialogActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useClassTypes } from "@/hooks/schedule/useClassTypes";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIScheduleGeneratorDialogProps {
  onOpenChange: (open: boolean) => void;
}

export const AIScheduleGeneratorDialog = ({ onOpenChange }: AIScheduleGeneratorDialogProps) => {
  const { classTypes } = useClassTypes();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [workloadBalance, setWorkloadBalance] = useState([50]);
  const [experiencePriority, setExperiencePriority] = useState([30]);
  const [availabilityWeight, setAvailabilityWeight] = useState([70]);
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate-ai-schedule', {
        body: {
          scheduleType: selectedType,
          preferences: {
            workloadBalance: workloadBalance[0],
            experiencePriority: experiencePriority[0],
            availabilityWeight: availabilityWeight[0]
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Schedule has been generated successfully.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast({
        title: "Error",
        description: "Failed to generate schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DialogContent className="bg-[#171717] border-0 max-w-md">
      <DialogHeader
        title="AI Schedule Generator"
        description="Generate optimized schedules based on staff availability and preferences"
      />
      
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <Label className="text-fitness-text">Schedule Type</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="bg-[#333333] border-[#d1d1d1] text-fitness-text">
              <SelectValue placeholder="Select schedule type" />
            </SelectTrigger>
            <SelectContent className="bg-[#333333] border-[#d1d1d1]">
              <SelectItem value="all" className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]">
                All Schedules
              </SelectItem>
              {classTypes?.map((type) => (
                <SelectItem
                  key={type.schedule_type_id}
                  value={type.name}
                  className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]"
                >
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-fitness-text">Workload Balance Priority</Label>
            <Slider
              value={workloadBalance}
              onValueChange={setWorkloadBalance}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-fitness-text/70">
              Higher values prioritize equal distribution of work hours
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-fitness-text">Experience Level Priority</Label>
            <Slider
              value={experiencePriority}
              onValueChange={setExperiencePriority}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-fitness-text/70">
              Higher values prioritize matching staff experience with schedule requirements
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-fitness-text">Availability Weight</Label>
            <Slider
              value={availabilityWeight}
              onValueChange={setAvailabilityWeight}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-fitness-text/70">
              Higher values strictly adhere to staff availability preferences
            </p>
          </div>
        </div>
      </div>

      <DialogActions
        onConfirm={handleGenerate}
        onClose={() => onOpenChange(false)}
        disabled={isGenerating}
      />
    </DialogContent>
  );
};