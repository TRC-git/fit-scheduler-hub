import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeSlotSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const TimeSlotSelector = ({ value, onChange, label }: TimeSlotSelectorProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-fitness-text text-sm">{label}</Label>
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[140px] bg-fitness-card text-fitness-text border-fitness-muted"
      />
    </div>
  );
};