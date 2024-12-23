import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

const PayrollSettings = () => {
  const { toast } = useToast();

  const { data: overtimeRules } = useQuery({
    queryKey: ['overtimeRules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('overtimerules')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const updateOvertimeRuleMutation = useMutation({
    mutationFn: async (ruleData: any) => {
      const { data, error } = await supabase
        .from('overtimerules')
        .upsert([ruleData]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payroll settings updated successfully",
      });
    },
  });

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text text-3xl">Payroll Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-6">
          {/* Pay Period Settings */}
          <div>
            <h2 className="text-fitness-text text-2xl font-semibold mb-4">Pay Period</h2>
            <Select>
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

          {/* Tax Settings */}
          <div>
            <h2 className="text-fitness-text text-2xl font-semibold mb-4">Tax Withholding Settings</h2>
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between">
                <Label className="text-fitness-text">Federal Tax Withholding</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-fitness-text">State Tax Withholding</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-fitness-text">Local Tax Withholding</Label>
                <Switch />
              </div>
            </div>
          </div>

          {/* Deductions & Benefits */}
          <div>
            <h2 className="text-fitness-text text-2xl font-semibold mb-4">Deductions & Benefits</h2>
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between">
                <Label className="text-fitness-text">Health Insurance</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-fitness-text">401(k)</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-fitness-text">Life Insurance</Label>
                <Switch />
              </div>
            </div>
          </div>

          {/* Overtime Rules */}
          <div>
            <h2 className="text-fitness-text text-2xl font-semibold mb-4">Overtime Rules</h2>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label className="text-fitness-text">Rule Description</Label>
                <Textarea 
                  placeholder="Enter overtime rule description..."
                  className="bg-fitness-inner text-fitness-text min-h-[100px]"
                />
              </div>
              {overtimeRules?.map((rule: any) => (
                <div key={rule.ruleid} className="p-4 bg-fitness-inner rounded-md">
                  <h4 className="text-fitness-text font-medium">{rule.description}</h4>
                  <p className="text-fitness-text/70 text-sm mt-1">
                    Threshold: {rule.thresholdhours} hours | Rate: {rule.overtimeratemultiplier}x
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Holiday & PTO Settings */}
          <div>
            <h2 className="text-fitness-text text-2xl font-semibold mb-4">Holiday & PTO Settings</h2>
            <div className="space-y-4 mt-2">
              <div>
                <Label className="text-fitness-text text-sm">Default PTO Days/Year</Label>
                <Input 
                  type="number" 
                  placeholder="15" 
                  className="bg-fitness-inner text-fitness-text"
                />
              </div>
              <div>
                <Label className="text-fitness-text text-sm">PTO Accrual Rate (hours/pay period)</Label>
                <Input 
                  type="number" 
                  placeholder="4.62" 
                  className="bg-fitness-inner text-fitness-text"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-fitness-text">Paid Holidays</Label>
                <Switch />
              </div>
            </div>
          </div>

          {/* Commission & Bonus Settings */}
          <div>
            <h2 className="text-fitness-text text-2xl font-semibold mb-4">Commission & Bonus Settings</h2>
            <div className="space-y-4 mt-2">
              <div>
                <Label className="text-fitness-text text-sm">Default Commission Rate (%)</Label>
                <Input 
                  type="number" 
                  placeholder="5" 
                  className="bg-fitness-inner text-fitness-text"
                />
              </div>
              <div>
                <Label className="text-fitness-text text-sm">Performance Bonus Threshold ($)</Label>
                <Input 
                  type="number" 
                  placeholder="5000" 
                  className="bg-fitness-inner text-fitness-text"
                />
              </div>
            </div>
          </div>

          {/* Direct Deposit Settings */}
          <div>
            <h2 className="text-fitness-text text-2xl font-semibold mb-4">Direct Deposit Settings</h2>
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

          <Button 
            className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
            onClick={() => updateOvertimeRuleMutation.mutate({
              description: "Standard Overtime",
              thresholdhours: 40,
              overtimeratemultiplier: 1.5
            })}
          >
            Save Payroll Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollSettings;