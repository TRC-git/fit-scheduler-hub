import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const TimeInput = ({ label, value, onChange }: TimeInputProps) => {
  return (
    <div>
      <Label className="text-fitness-text">{label}</Label>
      <Input 
        type="time" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-fitness-inner text-fitness-text" 
      />
    </div>
  );
};