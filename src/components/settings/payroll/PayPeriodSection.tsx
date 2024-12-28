import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePayPeriod } from "@/contexts/PayPeriodContext";

export const PayPeriodSection = () => {
  const { payPeriodType, setPayPeriodType } = usePayPeriod();

  return (
    <div>
      <h2 className="text-fitness-text text-xl font-semibold mb-4">Pay Period</h2>
      <Select value={payPeriodType} onValueChange={setPayPeriodType}>
        <SelectTrigger className="bg-fitness-inner text-fitness-text">
          <SelectValue placeholder="Select pay period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="biweekly">Bi-weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="semimonthly">Semi-monthly (15th & Last day)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};