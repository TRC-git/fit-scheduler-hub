import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PayrollSettings = () => {
  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Payroll Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label className="text-fitness-text">Pay Period</Label>
            <Select>
              <SelectTrigger className="bg-fitness-inner text-fitness-text">
                <SelectValue placeholder="Select pay period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-fitness-text">Overtime Threshold (hours/week)</Label>
            <Input 
              type="number" 
              placeholder="40" 
              className="bg-fitness-inner text-fitness-text"
            />
          </div>

          <div>
            <Label className="text-fitness-text">Overtime Rate Multiplier</Label>
            <Input 
              type="number" 
              placeholder="1.5" 
              className="bg-fitness-inner text-fitness-text"
            />
          </div>

          <div>
            <Label className="text-fitness-text">CPA Email</Label>
            <Input 
              type="email" 
              placeholder="cpa@example.com" 
              className="bg-fitness-inner text-fitness-text"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollSettings;