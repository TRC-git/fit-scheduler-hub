import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface CommissionSettingsProps {
  settings: any;
  onSettingChange: (field: string, value: any) => void;
}

const CommissionSettings = ({ settings, onSettingChange }: CommissionSettingsProps) => {
  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Commission & Bonus Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="enabled" className="text-fitness-text">Commission Enabled</Label>
          <Switch
            id="enabled"
            checked={settings?.enabled || false}
            onCheckedChange={(checked) => onSettingChange('enabled', checked)}
          />
        </div>
        {settings?.enabled && (
          <>
            <div>
              <Label htmlFor="commission_rate" className="text-fitness-text">Commission Rate (%)</Label>
              <Input
                id="commission_rate"
                type="number"
                value={settings?.commission_rate || ''}
                onChange={(e) => onSettingChange('commission_rate', parseFloat(e.target.value))}
                className="bg-fitness-muted text-fitness-text"
              />
            </div>
            <div>
              <Label htmlFor="performance_bonus_threshold" className="text-fitness-text">Performance Bonus Threshold ($)</Label>
              <Input
                id="performance_bonus_threshold"
                type="number"
                value={settings?.performance_bonus_threshold || ''}
                onChange={(e) => onSettingChange('performance_bonus_threshold', parseFloat(e.target.value))}
                className="bg-fitness-muted text-fitness-text"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CommissionSettings;