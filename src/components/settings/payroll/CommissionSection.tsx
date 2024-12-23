import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface CommissionSettings {
  enabled?: boolean;
  commission_rate?: number;
  performance_bonus_threshold?: number;
}

interface Props {
  settings?: CommissionSettings;
  onUpdate: (settings: CommissionSettings) => void;
}

export const CommissionSection = ({ settings, onUpdate }: Props) => {
  const [localSettings, setLocalSettings] = useState<CommissionSettings>(settings || {});

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-fitness-text text-xl font-semibold">Commission & Bonus Settings</h2>
        <Switch 
          checked={localSettings.enabled}
          onCheckedChange={(checked) => 
            setLocalSettings(prev => ({ ...prev, enabled: checked }))
          }
        />
      </div>
      {localSettings.enabled && (
        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-fitness-text text-sm">Default Commission Rate (%)</Label>
            <Input 
              type="number" 
              value={localSettings.commission_rate || ''}
              onChange={(e) => 
                setLocalSettings(prev => ({ 
                  ...prev, 
                  commission_rate: parseFloat(e.target.value) 
                }))
              }
              placeholder="5" 
              className="bg-fitness-inner text-fitness-text"
            />
          </div>
          <div>
            <Label className="text-fitness-text text-sm">Performance Bonus Threshold ($)</Label>
            <Input 
              type="number" 
              value={localSettings.performance_bonus_threshold || ''}
              onChange={(e) => 
                setLocalSettings(prev => ({ 
                  ...prev, 
                  performance_bonus_threshold: parseFloat(e.target.value) 
                }))
              }
              placeholder="5000" 
              className="bg-fitness-inner text-fitness-text"
            />
          </div>

          <Button 
            onClick={handleUpdate}
            className="w-full bg-[#15e7fb] hover:bg-[#15e7fb]/80"
          >
            Save Commission Settings
          </Button>
        </div>
      )}
    </div>
  );
};