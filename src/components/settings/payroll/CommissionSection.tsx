import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const CommissionSection = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-fitness-text text-xl font-semibold">Commission & Bonus Settings</h2>
        <Switch 
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </div>
      {enabled && (
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
      )}
    </div>
  );
};