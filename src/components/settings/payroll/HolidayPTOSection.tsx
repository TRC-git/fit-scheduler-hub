import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const HolidayPTOSection = () => {
  return (
    <div>
      <h2 className="text-fitness-text text-xl font-semibold mb-4">Holiday & PTO Settings</h2>
      <div className="space-y-4 mt-2">
        <div>
          <Label className="text-fitness-text text-sm">Default PTO Days/Year</Label>
          <Input 
            type="number" 
            placeholder="15" 
            className="bg-fitness-inner text-fitness-text"
          />
        </div>
        <div>
          <Label className="text-fitness-text text-sm">PTO Accrual Rate (hours/pay period)</Label>
          <Input 
            type="number" 
            placeholder="4.62" 
            className="bg-fitness-inner text-fitness-text"
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-fitness-text">Paid Holidays</Label>
          <Switch />
        </div>
      </div>
    </div>
  );
};