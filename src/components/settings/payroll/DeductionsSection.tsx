import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export const DeductionsSection = () => {
  const [healthEnabled, setHealthEnabled] = useState(false);
  const [retirementEnabled, setRetirementEnabled] = useState(false);
  const [lifeEnabled, setLifeEnabled] = useState(false);

  return (
    <div>
      <h2 className="text-fitness-text text-xl font-semibold mb-4">Deductions & Benefits</h2>
      <div className="space-y-4 mt-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">Health Insurance</Label>
            <Switch 
              checked={healthEnabled}
              onCheckedChange={setHealthEnabled}
            />
          </div>
          {healthEnabled && (
            <Input 
              type="number"
              placeholder="Enter health insurance deduction ($)"
              className="bg-fitness-inner text-fitness-text"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">401(k)</Label>
            <Switch 
              checked={retirementEnabled}
              onCheckedChange={setRetirementEnabled}
            />
          </div>
          {retirementEnabled && (
            <Input 
              type="number"
              placeholder="Enter 401(k) contribution (%)"
              className="bg-fitness-inner text-fitness-text"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">Life Insurance</Label>
            <Switch 
              checked={lifeEnabled}
              onCheckedChange={setLifeEnabled}
            />
          </div>
          {lifeEnabled && (
            <Input 
              type="number"
              placeholder="Enter life insurance premium ($)"
              className="bg-fitness-inner text-fitness-text"
            />
          )}
        </div>
      </div>
    </div>
  );
};