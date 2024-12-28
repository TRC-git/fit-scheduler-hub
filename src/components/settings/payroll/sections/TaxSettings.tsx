import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface TaxSettingsProps {
  settings: any;
  onSettingChange: (field: string, value: any) => void;
}

const TaxSettings = ({ settings, onSettingChange }: TaxSettingsProps) => {
  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Tax Withholding Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="federal_enabled" className="text-fitness-text">Federal Tax</Label>
          <Switch
            id="federal_enabled"
            checked={settings?.federal_enabled || false}
            onCheckedChange={(checked) => onSettingChange('federal_enabled', checked)}
          />
        </div>
        {settings?.federal_enabled && (
          <div>
            <Label htmlFor="federal_rate" className="text-fitness-text">Federal Tax Rate (%)</Label>
            <Input
              id="federal_rate"
              type="number"
              value={settings?.federal_rate || ''}
              onChange={(e) => onSettingChange('federal_rate', parseFloat(e.target.value))}
              className="bg-fitness-muted text-fitness-text"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Label htmlFor="state_enabled" className="text-fitness-text">State Tax</Label>
          <Switch
            id="state_enabled"
            checked={settings?.state_enabled || false}
            onCheckedChange={(checked) => onSettingChange('state_enabled', checked)}
          />
        </div>
        {settings?.state_enabled && (
          <div>
            <Label htmlFor="state_rate" className="text-fitness-text">State Tax Rate (%)</Label>
            <Input
              id="state_rate"
              type="number"
              value={settings?.state_rate || ''}
              onChange={(e) => onSettingChange('state_rate', parseFloat(e.target.value))}
              className="bg-fitness-muted text-fitness-text"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxSettings;