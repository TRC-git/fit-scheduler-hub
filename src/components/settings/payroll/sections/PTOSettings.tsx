import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface PTOSettingsProps {
  settings: any;
  onSettingChange: (field: string, value: any) => void;
}

const PTOSettings = ({ settings, onSettingChange }: PTOSettingsProps) => {
  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">PTO & Holiday Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="enabled" className="text-fitness-text">PTO Enabled</Label>
          <Switch
            id="enabled"
            checked={settings?.enabled || false}
            onCheckedChange={(checked) => onSettingChange('enabled', checked)}
          />
        </div>
        {settings?.enabled && (
          <>
            <div>
              <Label htmlFor="pto_days_per_year" className="text-fitness-text">PTO Days Per Year</Label>
              <Input
                id="pto_days_per_year"
                type="number"
                value={settings?.pto_days_per_year || ''}
                onChange={(e) => onSettingChange('pto_days_per_year', parseInt(e.target.value))}
                className="bg-fitness-muted text-fitness-text"
              />
            </div>
            <div>
              <Label htmlFor="pto_accrual_rate" className="text-fitness-text">PTO Accrual Rate (hours/pay period)</Label>
              <Input
                id="pto_accrual_rate"
                type="number"
                value={settings?.pto_accrual_rate || ''}
                onChange={(e) => onSettingChange('pto_accrual_rate', parseFloat(e.target.value))}
                className="bg-fitness-muted text-fitness-text"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PTOSettings;