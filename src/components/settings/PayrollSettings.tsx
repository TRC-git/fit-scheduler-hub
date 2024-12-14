import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
            <Label className="text-fitness-text">Overtime Rules</Label>
            <div className="space-y-4 mt-2">
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

          <div>
            <Label className="text-fitness-text">Default Overtime Threshold (hours/week)</Label>
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
            <Label className="text-fitness-text">Break Duration Rules</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-fitness-text text-sm">Minimum Break (minutes)</Label>
                <Input 
                  type="number" 
                  placeholder="30" 
                  className="bg-fitness-inner text-fitness-text"
                />
              </div>
              <div>
                <Label className="text-fitness-text text-sm">Break Frequency (hours)</Label>
                <Input 
                  type="number" 
                  placeholder="4" 
                  className="bg-fitness-inner text-fitness-text"
                />
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