import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface TimeSlotSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const TimeSlotSelector = ({ value, onChange, label }: TimeSlotSelectorProps) => {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      type="time"
      value={value}
      onChange={handleTimeChange}
      className="w-[140px] bg-fitness-card text-fitness-text border-fitness-muted"
      placeholder={label}
    />
  );
};