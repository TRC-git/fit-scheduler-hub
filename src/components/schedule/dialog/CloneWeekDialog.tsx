import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/schedule/dialog/DialogHeader";
import { DialogActions } from "@/components/schedule/dialog/DialogActions";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { startOfWeek, endOfWeek } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CloneWeekDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sourceWeekStart: Date;
}

export const CloneWeekDialog = ({ isOpen, onClose, sourceWeekStart }: CloneWeekDialogProps) => {
  const [targetDate, setTargetDate] = useState<Date>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCloneWeek = async () => {
    if (!targetDate) return;

    setIsLoading(true);
    try {
      const targetWeekStart = startOfWeek(targetDate, { weekStartsOn: 1 }); // 1 represents Monday
      
      // Get schedules for the source week
      const { data: sourceSchedules, error: fetchError } = await supabase
        .from('schedules')
        .select('*')
        .gte('shiftdate', sourceWeekStart.toISOString().split('T')[0])
        .lt('shiftdate', new Date(sourceWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (fetchError) throw fetchError;

      if (sourceSchedules && sourceSchedules.length > 0) {
        // Clone schedules to target week
        const newSchedules = sourceSchedules.map(schedule => {
          const dayDiff = new Date(schedule.shiftdate).getDay() - targetWeekStart.getDay();
          const newDate = new Date(targetWeekStart);
          newDate.setDate(newDate.getDate() + dayDiff);
          
          return {
            employeeid: schedule.employeeid,
            positionid: schedule.positionid,
            shiftdate: newDate.toISOString().split('T')[0],
            starttime: schedule.starttime,
            endtime: schedule.endtime,
            breakduration: schedule.breakduration,
            locationid: schedule.locationid,
            notes: schedule.notes,
            color: schedule.color
          };
        });

        const { error: insertError } = await supabase
          .from('schedules')
          .insert(newSchedules);

        if (insertError) throw insertError;

        toast({
          title: "Success",
          description: "Week schedule has been cloned successfully",
        });
        onClose();
      }
    } catch (error) {
      console.error('Error cloning week:', error);
      toast({
        title: "Error",
        description: "Failed to clone week schedule",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-fitness-card border-fitness-grid">
        <DialogHeader
          title="Clone Week Schedule"
          description="Select a target week to clone the current schedule to"
        />
        
        <div className="py-4">
          <Calendar
            mode="single"
            selected={targetDate}
            onSelect={setTargetDate}
            className="rounded-md border border-fitness-grid"
            disabled={(date) => date < new Date()}
            weekStartsOn={1} // Set Monday as the first day of the week
          />
        </div>

        <DialogActions
          onSubmit={handleCloneWeek}
          isDisabled={!targetDate || isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};