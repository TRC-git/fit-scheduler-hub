import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface TimeSlotItemProps {
  slot: {
    day_of_week: string;
    start_time: string;
    end_time: string;
    class_type: string;
  };
  index: number;
  classTypes: string[];
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
}

export const TimeSlotItem = ({
  slot,
  index,
  classTypes,
  onRemove,
  onUpdate,
}: TimeSlotItemProps) => {
  return (
    <div className="flex items-center gap-4 bg-fitness-card p-4 rounded-md">
      <Input
        type="time"
        value={slot.start_time}
        onChange={(e) => onUpdate(index, 'start_time', e.target.value)}
        className="bg-fitness-muted text-fitness-text"
      />
      
      <Input
        type="time"
        value={slot.end_time}
        onChange={(e) => onUpdate(index, 'end_time', e.target.value)}
        className="bg-fitness-muted text-fitness-text"
      />
      
      <Select
        value={slot.class_type}
        onValueChange={(value) => onUpdate(index, 'class_type', value)}
      >
        <SelectTrigger className="bg-fitness-muted text-fitness-text">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {classTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        type="button"
        variant="ghost"
        onClick={() => onRemove(index)}
        className="text-fitness-danger hover:text-fitness-danger/80"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};