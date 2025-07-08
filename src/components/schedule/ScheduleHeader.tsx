import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useClassTypes } from "@/hooks/schedule/useClassTypes";
import { useState } from "react";
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from "date-fns";
import { CloneWeekDialog } from "./dialog/CloneWeekDialog";
import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";
import { ClockInOutDialog } from "./dialog/ClockInOutDialog";
import { AIScheduleGeneratorDialog } from "./dialog/AIScheduleGeneratorDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const ScheduleHeader = () => {
  const { classTypes, isLoading } = useClassTypes();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isCloneDialogOpen, setIsCloneDialogOpen] = useState(false);
  const [isClockInDialogOpen, setIsClockInDialogOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const { selectedScheduleType, setSelectedScheduleType } = useScheduleContext();
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();

  const handlePreviousWeek = () => {
    setCurrentWeek(prevWeek => subWeeks(prevWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prevWeek => addWeeks(prevWeek, 1));
  };

  const handlePostSchedule = async () => {
    try {
      setIsPosting(true);
      
      // Call the edge function to send emails
      const { data, error } = await supabase.functions.invoke('send-schedule-emails');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Schedule has been posted and emails have been sent to all staff members.",
      });
    } catch (error) {
      console.error('Error posting schedule:', error);
      toast({
        title: "Error",
        description: "Failed to post schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  // Get the start (Monday) and end (Sunday) of the week
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 1 represents Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  const weekDisplay = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Select value={selectedScheduleType} onValueChange={setSelectedScheduleType}>
          <SelectTrigger className="w-[210px] bg-card text-foreground border-border">
            <SelectValue placeholder={isLoading ? "Loading..." : "All Schedules"} />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {isLoading ? (
              <SelectItem value="loading" disabled>Loading...</SelectItem>
            ) : (
              [
                <SelectItem key="all" value="all" className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">All Schedules</SelectItem>,
                ...(classTypes?.map((type) => (
                  <SelectItem key={type.schedule_type_id} value={type.name} className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                    {type.name}
                  </SelectItem>
                )) || [])
              ]
            )}
          </SelectContent>
        </Select>
        <Button
          onClick={handlePostSchedule}
          disabled={isPosting}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md w-[140px] hover:bg-secondary/80 transition-colors"
        >
          {isPosting ? "Posting..." : "Post Schedule"}
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setIsAIDialogOpen(true)}
          className="bg-[#333333] text-[#15e7fb] hover:bg-[#444444] p-2 rounded-md"
          size="icon"
        >
          <Sparkles className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-md border border-border">
          <ChevronLeft 
            className="w-5 h-5 text-foreground cursor-pointer hover:text-primary transition-colors" 
            onClick={handlePreviousWeek}
          />
          <span className="text-foreground min-w-[200px] text-center">{weekDisplay}</span>
          <ChevronRight 
            className="w-5 h-5 text-foreground cursor-pointer hover:text-primary transition-colors" 
            onClick={handleNextWeek}
          />
        </div>
        <button 
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          onClick={() => setIsCloneDialogOpen(true)}
        >
          Clone Week
        </button>
      </div>
      
      <button 
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        onClick={() => setIsClockInDialogOpen(true)}
      >
        Clock-In
      </button>

      <CloneWeekDialog
        isOpen={isCloneDialogOpen}
        onClose={() => setIsCloneDialogOpen(false)}
        sourceWeekStart={weekStart}
      />

      <ClockInOutDialog
        open={isClockInDialogOpen}
        onOpenChange={setIsClockInDialogOpen}
      />

      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <AIScheduleGeneratorDialog onOpenChange={setIsAIDialogOpen} />
      </Dialog>
    </div>
  );
};

export default ScheduleHeader;