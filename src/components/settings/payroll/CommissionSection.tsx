import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const CommissionSection = () => {
  return (
    <div>
      <h2 className="text-fitness-text text-xl font-semibold mb-4">Commission & Bonus Settings</h2>
      <div className="space-y-4 mt-2">
        <div>
          <Label className="text-fitness-text text-sm">Default Commission Rate (%)</Label>
          <Input 
            type="number" 
            placeholder="5" 
            className="bg-fitness-inner text-fitness-text"
          />
        </div>
        <div>
          <Label className="text-fitness-text text-sm">Performance Bonus Threshold ($)</Label>
          <Input 
            type="number" 
            placeholder="5000" 
            className="bg-fitness-inner text-fitness-text"
          />
        </div>
      </div>
    </div>
  );
};