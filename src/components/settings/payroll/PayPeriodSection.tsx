import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type PayPeriodType = "weekly" | "biweekly" | "monthly" | "semimonthly";

export const PayPeriodSection = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<PayPeriodType>("biweekly");
  const { toast } = useToast();

  const handlePeriodChange = (value: PayPeriodType) => {
    setSelectedPeriod(value);
    toast({
      title: "Pay Period Updated",
      description: `Pay period has been set to ${value}`,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-fitness-text text-xl font-semibold mb-4">Pay Period</h2>
      <div className="space-y-2">
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className="bg-fitness-inner text-fitness-text w-full">
            <SelectValue placeholder="Select pay period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="biweekly">Bi-weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="semimonthly">Semi-monthly (15th & Last day)</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          className="w-full bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
          onClick={() => {
            toast({
              title: "Success",
              description: "Pay period settings have been saved",
            });
          }}
        >
          Save Pay Period Settings
        </Button>
      </div>
    </div>
  );
};