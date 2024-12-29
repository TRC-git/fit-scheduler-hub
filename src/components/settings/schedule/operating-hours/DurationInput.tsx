import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DurationInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const DurationInput = ({ value, onChange }: DurationInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    // Ensure the value is between 15 and 120 minutes
    if (newValue >= 15 && newValue <= 120) {
      onChange(newValue);
    }
  };

  return (
    <div>
      <Label className="text-fitness-text">Slot Duration (minutes)</Label>
      <Input 
        type="number" 
        value={value}
        onChange={handleChange}
        min={15}
        max={120}
        step={15}
        className="bg-fitness-inner text-fitness-text" 
      />
    </div>
  );
};