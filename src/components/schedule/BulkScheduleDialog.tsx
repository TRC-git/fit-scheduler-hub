import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useClassTypes } from "@/hooks/schedule/useClassTypes";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface BulkScheduleDialogProps {
  employeeId: number;
  employeeName: string;
  onClose: () => void;
  open: boolean;
}

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  selected: boolean;
}

export const BulkScheduleDialog = ({
  employeeId,
  employeeName,
  onClose,
  open
}: BulkScheduleDialogProps) => {
  const { classTypes } = useClassTypes();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Fetch employee availability when dialog opens
  const fetchAvailability = async () => {
    try {
      const { data: availabilityData, error } = await supabase
        .from('employeeavailability')
        .select('*')
        .eq('5', employeeId);

      if (error) throw error;

      const slots = availabilityData.map(slot => ({
        day: slot.dayofweek,
        startTime: slot.starttime,
        endTime: slot.endtime,
        selected: false
      }));

      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: "Error",
        description: "Failed to fetch employee availability",
        variant: "destructive"
      });
    }
  };

  const toggleTimeSlot = (index: number) => {
    setAvailableSlots(prev => prev.map((slot, i) => 
      i === index ? { ...slot, selected: !slot.selected } : slot
    ));
  };

  const handleSchedule = async () => {
    if (!selectedType) {
      toast({
        title: "Error",
        description: "Please select a class type",
        variant: "destructive"
      });
      return;
    }

    const selectedSlots = availableSlots.filter(slot => slot.selected);
    if (selectedSlots.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one time slot",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create schedules for each selected slot
      const schedulesToCreate = selectedSlots.map(slot => ({
        employeeid: employeeId,
        shiftdate: new Date().toISOString().split('T')[0], // You might want to adjust this
        starttime: slot.startTime,
        endtime: slot.endTime,
        notes: `Bulk scheduled ${selectedType} class`,
        is_template: false
      }));

      const { error } = await supabase
        .from('schedules')
        .insert(schedulesToCreate);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bulk schedule created successfully"
      });
      onClose();
    } catch (error) {
      console.error('Error creating schedules:', error);
      toast({
        title: "Error",
        description: "Failed to create schedules",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#171717] border-0 w-[calc(100%-2rem)] max-w-[32rem]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-fitness-text">Add Bulk Schedule</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-fitness-text hover:bg-fitness-card/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-fitness-accent/20" />
            <div>
              <h3 className="text-fitness-text font-medium">{employeeName}</h3>
              <p className="text-fitness-text/70 text-sm">Coach</p>
            </div>
          </div>

          <div>
            <Select onValueChange={setSelectedType} value={selectedType}>
              <SelectTrigger className="bg-[#333333] border-[#d1d1d1] text-fitness-text">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent className="bg-[#333333] border-[#d1d1d1]">
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

          <div className="grid grid-cols-2 gap-4">
            {availableSlots.map((slot, index) => (
              <div key={index} className="space-y-2">
                <Button
                  type="button"
                  variant={slot.selected ? "default" : "secondary"}
                  className={`w-full ${
                    slot.selected 
                      ? "bg-fitness-accent text-[#1A1F2C]" 
                      : "bg-[#333333] text-fitness-text"
                  }`}
                  onClick={() => toggleTimeSlot(index)}
                >
                  {slot.day}
                </Button>
                <div className="text-center text-sm text-fitness-text/70">
                  {`${slot.startTime} - ${slot.endTime}`}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-[#333333] text-fitness-text hover:bg-[#444444]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSchedule}
              className="bg-[#15e7fb] text-[#1A1F2C] hover:bg-[#15e7fb]/80"
            >
              Schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};