import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface OvertimeSectionProps {
  settings?: any[];
  onUpdate: (overtime: any) => void;
}

export const OvertimeSection = ({ settings, onUpdate }: OvertimeSectionProps) => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-fitness-text text-xl font-semibold">Overtime Rules</h2>
        <Switch 
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </div>
      {enabled && (
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-fitness-text">Rule Description</Label>
            <Textarea 
              placeholder="Enter overtime rule description..."
              className="bg-fitness-inner text-fitness-text min-h-[100px]"
            />
          </div>
          {settings?.map((rule: any) => (
            <div key={rule.ruleid} className="p-4 bg-fitness-inner rounded-md">
              <h4 className="text-fitness-text font-medium">{rule.description}</h4>
              <p className="text-fitness-text/70 text-sm mt-1">
                Threshold: {rule.thresholdhours} hours | Rate: {rule.overtimeratemultiplier}x
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};