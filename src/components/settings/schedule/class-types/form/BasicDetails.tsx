import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicDetailsProps {
  name: string;
  duration: number;
  onChange: (field: string, value: string | number) => void;
}

const BasicDetails = ({ name, duration, onChange }: BasicDetailsProps) => {
  return (
    <>
      <div>
        <Label className="text-fitness-text">Schedule Name</Label>
        <Input
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          className="bg-fitness-inner text-fitness-text"
          required
        />
      </div>

      <div>
        <Label className="text-fitness-text">Duration (minutes)</Label>
        <Input
          type="number"
          value={duration}
          onChange={(e) => onChange('duration', parseInt(e.target.value))}
          className="bg-fitness-inner text-fitness-text"
          required
        />
      </div>
    </>
  );
};

export default BasicDetails;