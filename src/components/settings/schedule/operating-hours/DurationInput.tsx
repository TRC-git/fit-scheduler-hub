import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DurationInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const DurationInput = ({ value, onChange }: DurationInputProps) => {
  return (
    <div>
      <Label className="text-fitness-text">Slot Duration (minutes)</Label>
      <Input 
        type="number" 
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        min={15}
        max={120}
        step={15}
        className="bg-fitness-inner text-fitness-text" 
      />
    </div>
  );
};