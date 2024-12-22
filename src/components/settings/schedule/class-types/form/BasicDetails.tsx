import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicDetailsProps {
  name: string;
  duration: number;
  onChange: (field: string, value: any) => void;
}

const BasicDetails = ({ name, duration, onChange }: BasicDetailsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-fitness-text">Schedule Type Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onChange('name', e.target.value)}
          className="bg-fitness-card text-fitness-text"
        />
      </div>
      
      <div>
        <Label htmlFor="duration" className="text-fitness-text">Duration (minutes)</Label>
        <Input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => onChange('duration', parseInt(e.target.value))}
          className="bg-fitness-card text-fitness-text"
        />
      </div>
    </div>
  );
};

export default BasicDetails;