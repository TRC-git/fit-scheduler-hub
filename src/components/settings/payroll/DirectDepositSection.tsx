import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const DirectDepositSection = () => {
  return (
    <div>
      <h2 className="text-fitness-text text-xl font-semibold mb-4">Direct Deposit Settings</h2>
      <div className="space-y-4 mt-2">
        <div className="flex items-center justify-between">
          <Label className="text-fitness-text">Enable Direct Deposit</Label>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-fitness-text">Allow Split Payments</Label>
          <Switch />
        </div>
      </div>
    </div>
  );
};