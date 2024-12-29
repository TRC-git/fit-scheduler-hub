import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TimeSlotSelector } from "../TimeSlotSelector";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TimeSlot } from "../types";

interface TimeSlotItemProps {
  slot: TimeSlot;
  index: number;
  onRemove: () => void;
  onUpdate: (field: keyof TimeSlot, value: any) => void;
}

export const TimeSlotItem = ({ slot, index, onRemove, onUpdate }: TimeSlotItemProps) => {
  return (
    <div className="flex items-center gap-4 bg-fitness-card p-4 rounded-md">
      <TimeSlotSelector
        value={slot.starttime}
        onChange={(value) => onUpdate('starttime', value)}
        label="Start Time"
      />
      
      <TimeSlotSelector
        value={slot.endtime}
        onChange={(value) => onUpdate('endtime', value)}
        label="End Time"
      />
      
      <Checkbox
        checked={slot.ispreferred}
        onCheckedChange={(checked) => onUpdate('ispreferred', checked)}
        className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
      />
      <Label className="text-fitness-text">Preferred</Label>
      
      <Button
        type="button"
        variant="ghost"
        onClick={onRemove}
        className="ml-auto text-red-500 hover:text-red-600"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};