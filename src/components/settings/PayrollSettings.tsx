import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PayPeriodSection } from "./payroll/PayPeriodSection";
import { TaxWithholdingSection } from "./payroll/TaxWithholdingSection";
import { DeductionsSection } from "./payroll/DeductionsSection";
import { OvertimeSection } from "./payroll/OvertimeSection";
import { HolidayPTOSection } from "./payroll/HolidayPTOSection";
import { CommissionSection } from "./payroll/CommissionSection";
import { DirectDepositSection } from "./payroll/DirectDepositSection";

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
      <CardContent className="space-y-12">
        <div className="grid gap-8">
          <PayPeriodSection />
          <TaxWithholdingSection />
          <DeductionsSection />
          <OvertimeSection overtimeRules={overtimeRules} />
          <HolidayPTOSection />
          <CommissionSection />
          <DirectDepositSection />

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