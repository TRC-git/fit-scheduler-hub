import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface PTOSettings {
  enabled?: boolean;
  pto_days_per_year?: number;
  pto_accrual_rate?: number;
  paid_holidays_enabled?: boolean;
  current_pto_balance?: number;
}

interface Props {
  settings?: PTOSettings;
  onUpdate: (settings: PTOSettings) => void;
}

export const HolidayPTOSection = ({ settings, onUpdate }: Props) => {
  const [localSettings, setLocalSettings] = useState<PTOSettings>(settings || {});

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
        <h2 className="text-fitness-text text-xl font-semibold">Holiday & PTO Settings</h2>
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
            <Label className="text-fitness-text text-sm">Default PTO Days/Year</Label>
            <Input 
              type="number" 
              value={localSettings.pto_days_per_year || ''}
              onChange={(e) => 
                setLocalSettings(prev => ({ 
                  ...prev, 
                  pto_days_per_year: parseInt(e.target.value) 
                }))
              }
              placeholder="15" 
              className="bg-fitness-inner text-fitness-text"
            />
          </div>
          <div>
            <Label className="text-fitness-text text-sm">PTO Accrual Rate (hours/pay period)</Label>
            <Input 
              type="number" 
              value={localSettings.pto_accrual_rate || ''}
              onChange={(e) => 
                setLocalSettings(prev => ({ 
                  ...prev, 
                  pto_accrual_rate: parseFloat(e.target.value) 
                }))
              }
              placeholder="4.62" 
              className="bg-fitness-inner text-fitness-text"
            />
          </div>
          <div>
            <Label className="text-fitness-text text-sm">Current PTO Balance</Label>
            <Input 
              type="number" 
              value={localSettings.current_pto_balance || ''}
              onChange={(e) => 
                setLocalSettings(prev => ({ 
                  ...prev, 
                  current_pto_balance: parseFloat(e.target.value) 
                }))
              }
              placeholder="0" 
              className="bg-fitness-inner text-fitness-text"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-fitness-text">Paid Holidays</Label>
            <Switch 
              checked={localSettings.paid_holidays_enabled}
              onCheckedChange={(checked) => 
                setLocalSettings(prev => ({ ...prev, paid_holidays_enabled: checked }))
              }
            />
          </div>

          <Button 
            onClick={handleUpdate}
            className="w-full bg-[#15e7fb] hover:bg-[#15e7fb]/80"
          >
            Save PTO Settings
          </Button>
        </div>
      )}
    </div>
  );
};