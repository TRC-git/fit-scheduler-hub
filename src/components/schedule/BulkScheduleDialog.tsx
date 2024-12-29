import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

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
  const { dates } = useScheduleContext();

  const handleDateToggle = (date: Date) => {
    if (selectedDates.some(d => d.getTime() === date.getTime())) {
      setSelectedDates(prev => prev.filter(d => d.getTime() !== date.getTime()));
    } else {
      setSelectedDates(prev => [...prev, date]);
    }
  };

  const handleSubmit = () => {
    console.log("Selected dates for employee", employeeId, selectedDates);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
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

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={selectedDates.length === 0}
              className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
            >
              Schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};