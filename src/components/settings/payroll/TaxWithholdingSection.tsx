import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TaxSettings {
  federal_enabled?: boolean;
  federal_rate?: number;
  state_enabled?: boolean;
  state_rate?: number;
  local_enabled?: boolean;
  local_rate?: number;
  social_security_enabled?: boolean;
  social_security_rate?: number;
  fica_enabled?: boolean;
  fica_rate?: number;
}

interface Props {
  settings?: TaxSettings;
  onUpdate: (settings: TaxSettings) => void;
}

export const TaxWithholdingSection = ({ settings, onUpdate }: Props) => {
  const [localSettings, setLocalSettings] = useState<TaxSettings>(settings || {});

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
      <h2 className="text-fitness-text text-xl font-semibold mb-4">Tax Withholding Settings</h2>
      <div className="space-y-4 mt-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">Federal Tax Withholding</Label>
            <Switch 
              checked={localSettings.federal_enabled}
              onCheckedChange={(checked) => 
                setLocalSettings(prev => ({ ...prev, federal_enabled: checked }))
              }
            />
          </div>
          {localSettings.federal_enabled && (
            <Input 
              type="number"
              placeholder="Enter federal tax rate (%)"
              value={localSettings.federal_rate || ''}
              onChange={(e) => 
                setLocalSettings(prev => ({ 
                  ...prev, 
                  federal_rate: parseFloat(e.target.value) 
                }))
              }
              className="bg-fitness-inner text-fitness-text"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">State Tax Withholding</Label>
            <Switch 
              checked={localSettings.state_enabled}
              onCheckedChange={(checked) => 
                setLocalSettings(prev => ({ ...prev, state_enabled: checked }))
              }
            />
          </div>
          {localSettings.state_enabled && (
            <Input 
              type="number"
              placeholder="Enter state tax rate (%)"
              value={localSettings.state_rate || ''}
              onChange={(e) => 
                setLocalSettings(prev => ({ 
                  ...prev, 
                  state_rate: parseFloat(e.target.value) 
                }))
              }
              className="bg-fitness-inner text-fitness-text"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">Local Tax Withholding</Label>
            <Switch 
              checked={localSettings.local_enabled}
              onCheckedChange={(checked) => 
                setLocalSettings(prev => ({ ...prev, local_enabled: checked }))
              }
            />
          </div>
          {localSettings.local_enabled && (
            <Input 
              type="number"
              placeholder="Enter local tax rate (%)"
              value={localSettings.local_rate || ''}
              onChange={(e) => 
                setLocalSettings(prev => ({ 
                  ...prev, 
                  local_rate: parseFloat(e.target.value) 
                }))
              }
              className="bg-fitness-inner text-fitness-text"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">Social Security Tax</Label>
            <Switch 
              checked={localSettings.social_security_enabled}
              onCheckedChange={(checked) => 
                setLocalSettings(prev => ({ ...prev, social_security_enabled: checked }))
              }
            />
          </div>
          {localSettings.social_security_enabled && (
            <Input 
              type="number"
              placeholder="Enter Social Security tax rate (%)"
              value={localSettings.social_security_rate || ''}
              onChange={(e) => 
                setLocalSettings(prev => ({ 
                  ...prev, 
                  social_security_rate: parseFloat(e.target.value) 
                }))
              }
              className="bg-fitness-inner text-fitness-text"
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">FICA Medicare Tax</Label>
            <Switch 
              checked={localSettings.fica_enabled}
              onCheckedChange={(checked) => 
                setLocalSettings(prev => ({ ...prev, fica_enabled: checked }))
              }
            />
          </div>
          {localSettings.fica_enabled && (
            <Input 
              type="number"
              placeholder="Enter FICA Medicare tax rate (%)"
              value={localSettings.fica_rate || ''}
              onChange={(e) => 
                setLocalSettings(prev => ({ 
                  ...prev, 
                  fica_rate: parseFloat(e.target.value) 
                }))
              }
              className="bg-fitness-inner text-fitness-text"
            />
          )}
        </div>

        <Button 
          onClick={handleUpdate}
          className="w-full bg-[#15e7fb] hover:bg-[#15e7fb]/80"
        >
          Save Tax Settings
        </Button>
      </div>
    </div>
  );
};