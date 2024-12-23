import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DeductionSettings {
  health_insurance_enabled?: boolean;
  health_insurance_amount?: number;
  retirement_enabled?: boolean;
  retirement_percentage?: number;
  life_insurance_enabled?: boolean;
  life_insurance_amount?: number;
}

interface Props {
  settings?: DeductionSettings;
  onUpdate: (settings: DeductionSettings) => void;
}

export const DeductionsSection = ({ settings, onUpdate }: Props) => {
  const [localSettings, setLocalSettings] = useState<DeductionSettings>(settings || {});

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleUpdate = () => {
    onUpdate(localSettings);
  };

  return (
    <div>
      <h2 className="text-fitness-text text-xl font-semibold mb-4">Deductions & Benefits</h2>
      <div className="space-y-4 mt-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">Health Insurance</Label>
            <Switch 
              checked={localSettings.health_insurance_enabled}
              onCheckedChange={(checked) => 
                setLocalSettings(prev => ({ ...prev, health_insurance_enabled: checked }))
              }
            />
          </div>
          {localSettings.health_insurance_enabled && (
            <Input 
              type="number"
              placeholder="Enter health insurance deduction ($)"
              value={localSettings.health_insurance_amount || ''}
              onChange={(e) => 
                setLocalSettings(prev => ({ 
                  ...prev, 
                  health_insurance_amount: parseFloat(e.target.value) 
                }))
              }
              className="bg-fitness-inner text-fitness-text"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">401(k)</Label>
            <Switch 
              checked={localSettings.retirement_enabled}
              onCheckedChange={(checked) => 
                setLocalSettings(prev => ({ ...prev, retirement_enabled: checked }))
              }
            />
          </div>
          {localSettings.retirement_enabled && (
            <Input 
              type="number"
              placeholder="Enter 401(k) contribution (%)"
              value={localSettings.retirement_percentage || ''}
              onChange={(e) => 
                setLocalSettings(prev => ({ 
                  ...prev, 
                  retirement_percentage: parseFloat(e.target.value) 
                }))
              }
              className="bg-fitness-inner text-fitness-text"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">Life Insurance</Label>
            <Switch 
              checked={localSettings.life_insurance_enabled}
              onCheckedChange={(checked) => 
                setLocalSettings(prev => ({ ...prev, life_insurance_enabled: checked }))
              }
            />
          </div>
          {localSettings.life_insurance_enabled && (
            <Input 
              type="number"
              placeholder="Enter life insurance premium ($)"
              value={localSettings.life_insurance_amount || ''}
              onChange={(e) => 
                setLocalSettings(prev => ({ 
                  ...prev, 
                  life_insurance_amount: parseFloat(e.target.value) 
                }))
              }
              className="bg-fitness-inner text-fitness-text"
            />
          )}
        </div>

        <Button 
          onClick={handleUpdate}
          className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
        >
          Save Deduction Settings
        </Button>
      </div>
    </div>
  );
};