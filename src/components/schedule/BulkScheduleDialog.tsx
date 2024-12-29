import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useClassTypes } from "@/hooks/schedule/useClassTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface BulkScheduleDialogProps {
  employeeId: number;
  employeeName: string;
  onClose: () => void;
  open: boolean;
}

export const BulkScheduleDialog = ({
  employeeId,
  employeeName,
  onClose,
  open
}: BulkScheduleDialogProps) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedClassType, setSelectedClassType] = useState<string>("");
  const { dates } = useScheduleContext();
  const { classTypes, isLoading: isLoadingClassTypes } = useClassTypes();
  const [isLoading, setIsLoading] = useState(false);

  const handleDateToggle = (date: Date) => {
    if (selectedDates.some(d => d.getTime() === date.getTime())) {
      setSelectedDates(prev => prev.filter(d => d.getTime() !== date.getTime()));
    } else {
      setSelectedDates(prev => [...prev, date]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClassType) {
      console.error("No class type selected");
      return;
    }

    setIsLoading(true);
    try {
      // Get the class type details
      const selectedType = classTypes?.find(type => type.name === selectedClassType);
      if (!selectedType) throw new Error("Class type not found");

      // Get employee availability
      const { data: availability } = await supabase
        .from('employeeavailability')
        .select('*')
        .eq('5', employeeId);

      // For each selected date, create a schedule
      for (const date of selectedDates) {
        const dayOfWeek = format(date, 'EEE');
        const dayAvailability = availability?.find(a => a.dayofweek === dayOfWeek);

        if (dayAvailability) {
          await supabase.from('schedules').insert({
            employeeid: employeeId,
            shiftdate: format(date, 'yyyy-MM-dd'),
            starttime: dayAvailability.starttime,
            endtime: dayAvailability.endtime,
            notes: `Bulk scheduled for ${selectedClassType}`
          });
        }
      }

      onClose();
    } catch (error) {
      console.error('Error creating bulk schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-fitness-card border-fitness-muted">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-fitness-accent/20 flex items-center justify-center">
              <span className="text-[#15e7fb] font-medium">
                {employeeName.split(' ').map(name => name[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-fitness-text">
                Bulk Schedule
              </h2>
              <p className="text-sm text-gray-500">{employeeName}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-fitness-text mb-2 block">
                Class Type
              </label>
              <Select
                value={selectedClassType}
                onValueChange={setSelectedClassType}
              >
                <SelectTrigger className="w-full bg-fitness-inner text-fitness-text">
                  <SelectValue placeholder="Select class type" />
                </SelectTrigger>
                <SelectContent className="bg-fitness-card border-fitness-muted">
                  {isLoadingClassTypes ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    classTypes?.map((type) => (
                      <SelectItem
                        key={type.schedule_type_id}
                        value={type.name}
                        className="text-fitness-text hover:bg-[#15e7fb] hover:text-[#333333]"
                      >
                        {type.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {dates.map((date) => (
                  <Button
                    key={date.toISOString()}
                    variant="outline"
                    className={`w-full justify-start ${
                      selectedDates.some(d => d.getTime() === date.getTime())
                        ? "border-fitness-accent text-fitness-accent"
                        : ""
                    }`}
                    onClick={() => handleDateToggle(date)}
                  >
                    {format(date, "EEEE, MMMM d")}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="bg-fitness-inner text-fitness-text hover:bg-fitness-muted"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={selectedDates.length === 0 || !selectedClassType || isLoading}
              className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
            >
              {isLoading ? "Scheduling..." : "Schedule"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};