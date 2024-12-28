import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface DeductionsSettingsProps {
  settings: any;
  onSettingChange: (field: string, value: any) => void;
}

const DeductionsSettings = ({ settings, onSettingChange }: DeductionsSettingsProps) => {
  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Deductions Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="health_insurance_enabled" className="text-fitness-text">Health Insurance</Label>
          <Switch
            id="health_insurance_enabled"
            checked={settings?.health_insurance_enabled || false}
            onCheckedChange={(checked) => onSettingChange('health_insurance_enabled', checked)}
          />
        </div>
        {settings?.health_insurance_enabled && (
          <div>
            <Label htmlFor="health_insurance_amount" className="text-fitness-text">Health Insurance Amount</Label>
            <Input
              id="health_insurance_amount"
              type="number"
              value={settings?.health_insurance_amount || ''}
              onChange={(e) => onSettingChange('health_insurance_amount', parseFloat(e.target.value))}
              className="bg-fitness-muted text-fitness-text"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="retirement_enabled" className="text-fitness-text">Retirement Plan</Label>
          <Switch
            id="retirement_enabled"
            checked={settings?.retirement_enabled || false}
            onCheckedChange={(checked) => onSettingChange('retirement_enabled', checked)}
          />
        </div>
        {settings?.retirement_enabled && (
          <div>
            <Label htmlFor="retirement_percentage" className="text-fitness-text">Retirement Contribution (%)</Label>
            <Input
              id="retirement_percentage"
              type="number"
              value={settings?.retirement_percentage || ''}
              onChange={(e) => onSettingChange('retirement_percentage', parseFloat(e.target.value))}
              className="bg-fitness-muted text-fitness-text"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeductionsSettings;