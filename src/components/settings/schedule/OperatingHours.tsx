import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const OperatingHours = () => {
  return (
    <div>
      <h3 className="text-fitness-text mb-4">Operating Hours</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-fitness-text">Opening Time</Label>
          <Input type="time" className="bg-fitness-inner text-fitness-text" />
        </div>
        <div>
          <Label className="text-fitness-text">Closing Time</Label>
          <Input type="time" className="bg-fitness-inner text-fitness-text" />
        </div>
      </div>
    </div>
  );
};

export default OperatingHours;