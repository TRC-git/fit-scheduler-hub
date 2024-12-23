import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export const TaxWithholdingSection = () => {
  const [federalEnabled, setFederalEnabled] = useState(false);
  const [stateEnabled, setStateEnabled] = useState(false);
  const [localEnabled, setLocalEnabled] = useState(false);

  return (
    <div>
      <h2 className="text-fitness-text text-xl font-semibold mb-4">Tax Withholding Settings</h2>
      <div className="space-y-4 mt-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">Federal Tax Withholding</Label>
            <Switch 
              checked={federalEnabled}
              onCheckedChange={setFederalEnabled}
            />
          </div>
          {federalEnabled && (
            <Input 
              type="number"
              placeholder="Enter federal tax rate (%)"
              className="bg-fitness-inner text-fitness-text"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">State Tax Withholding</Label>
            <Switch 
              checked={stateEnabled}
              onCheckedChange={setStateEnabled}
            />
          </div>
          {stateEnabled && (
            <Input 
              type="number"
              placeholder="Enter state tax rate (%)"
              className="bg-fitness-inner text-fitness-text"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">Local Tax Withholding</Label>
            <Switch 
              checked={localEnabled}
              onCheckedChange={setLocalEnabled}
            />
          </div>
          {localEnabled && (
            <Input 
              type="number"
              placeholder="Enter local tax rate (%)"
              className="bg-fitness-inner text-fitness-text"
            />
          )}
        </div>
      </div>
    </div>
  );
};