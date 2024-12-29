import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useClassTypes } from "@/hooks/schedule/useClassTypes";
import { useState } from "react";
import { DialogHeader } from "./dialog/DialogHeader";
import { DialogActions } from "./dialog/DialogActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useScheduleContext } from "@/contexts/schedule/ScheduleContext";
import { useOperationalDays } from "@/contexts/operational-days/useOperationalDays";
import { useTimeSlots } from "@/hooks/schedule/useTimeSlots";

interface BulkScheduleDialogProps {
  employeeId: number;
  employeeName: string;
  employeePositions: { positions: { positionname: string } }[];
  onClose: () => void;
  open: boolean;
}

export const BulkScheduleDialog = ({
  employeeId,
  employeeName,
  employeePositions,
  onClose,
  open,
}: BulkScheduleDialogProps) => {
  const { classTypes, isLoading } = useClassTypes();
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const { addBulkAppointments } = useScheduleContext();
  const { operationalDays } = useOperationalDays();
  const { timeSlots } = useTimeSlots();

  // Filter class types based on employee positions
  const availableClassTypes = classTypes?.filter(type => 
    employeePositions.some(pos => 
      pos.positions.positionname.toLowerCase() === type.name.toLowerCase()
    )
  );

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleDayToggle = (day: string) => {
    setSelectedDays(current =>
      current.includes(day)
        ? current.filter(d => d !== day)
        : [...current, day]
    );
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    setSelectedTimeSlots(current =>
      current.includes(timeSlot)
        ? current.filter(t => t !== timeSlot)
        : [...current, timeSlot]
    );
  };

  const handleConfirm = () => {
    if (!selectedType || selectedDays.length === 0 || selectedTimeSlots.length === 0) return;

    const appointments = selectedDays.flatMap(day =>
      selectedTimeSlots.map(timeSlot => ({
        day,
        timeSlot,
        name: employeeName,
        type: selectedType,
      }))
    );

    addBulkAppointments(appointments);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader
          title={`Schedule ${employeeName}`}
          description="Add multiple appointments for this staff member."
        />

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Class Type</Label>
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a class type" />
              </SelectTrigger>
              <SelectContent>
                {availableClassTypes?.map((type) => (
                  <SelectItem key={type.schedule_type_id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Days</Label>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => (
                <div
                  key={day}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-md cursor-pointer border transition-colors",
                    operationalDays.has(day)
                      ? selectedDays.includes(day)
                        ? "border-[#15e7fb] bg-[#15e7fb]/10"
                        : "border-gray-600 hover:border-[#15e7fb]"
                      : "border-gray-800 bg-gray-900/50 cursor-not-allowed opacity-50"
                  )}
                  onClick={() => operationalDays.has(day) && handleDayToggle(day)}
                >
                  <span className="text-xs text-gray-400">{format(new Date(`2024/01/${days.indexOf(day) + 1}`), 'EEE')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Time Slots</Label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((timeSlot) => (
                <div
                  key={timeSlot}
                  className={cn(
                    "p-2 rounded-md cursor-pointer border text-center text-sm transition-colors",
                    selectedTimeSlots.includes(timeSlot)
                      ? "border-[#15e7fb] bg-[#15e7fb]/10"
                      : "border-gray-600 hover:border-[#15e7fb]"
                  )}
                  onClick={() => handleTimeSlotToggle(timeSlot)}
                >
                  {timeSlot}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogActions
          onClose={onClose}
          onConfirm={handleConfirm}
          disabled={!selectedType || selectedDays.length === 0 || selectedTimeSlots.length === 0}
        />
      </DialogContent>
    </Dialog>
  );
};