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
import { Settings2 } from "lucide-react";

const PayrollSettings = () => {
  const { toast } = useToast();

  const { data: employeeId } = useQuery({
    queryKey: ['currentEmployee'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data: employee } = await supabase
        .from('employees')
        .select('employeeid')
        .eq('email', user.email)
        .single();
      
      return employee?.employeeid;
    }
  });

  const { data: settings } = useQuery({
    queryKey: ['payrollSettings', employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      const [
        { data: tax },
        { data: deductions },
        { data: pto },
        { data: commission },
        { data: overtime }
      ] = await Promise.all([
        supabase
          .from('tax_withholding_settings')
          .select('*')
          .eq('employee_id', employeeId)
          .single(),
        supabase
          .from('employee_deductions')
          .select('*')
          .eq('employee_id', employeeId)
          .single(),
        supabase
          .from('pto_holiday_settings')
          .select('*')
          .eq('employee_id', employeeId)
          .single(),
        supabase
          .from('commission_bonus_settings')
          .select('*')
          .eq('employee_id', employeeId)
          .single(),
        supabase
          .from('overtimerules')
          .select('*')
      ]);

      return {
        tax,
        deductions,
        pto,
        commission,
        overtime
      };
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: any) => {
      const promises = [];
      
      if (updates.tax) {
        promises.push(
          supabase
            .from('tax_withholding_settings')
            .upsert({ ...updates.tax, employee_id: employeeId })
        );
      }
      
      if (updates.deductions) {
        promises.push(
          supabase
            .from('employee_deductions')
            .upsert({ ...updates.deductions, employee_id: employeeId })
        );
      }
      
      if (updates.pto) {
        promises.push(
          supabase
            .from('pto_holiday_settings')
            .upsert({ ...updates.pto, employee_id: employeeId })
        );
      }
      
      if (updates.commission) {
        promises.push(
          supabase
            .from('commission_bonus_settings')
            .upsert({ ...updates.commission, employee_id: employeeId })
        );
      }

      if (updates.overtime) {
        promises.push(
          supabase
            .from('overtimerules')
            .upsert(updates.overtime)
        );
      }

      await Promise.all(promises);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payroll settings updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update payroll settings",
        variant: "destructive",
      });
    }
  });

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings2 className="w-6 h-6 text-fitness-text" />
          <CardTitle className="text-fitness-text text-3xl">Payroll Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-12">
        <div className="grid gap-8">
          <PayPeriodSection />
          <TaxWithholdingSection 
            settings={settings?.tax} 
            onUpdate={(tax) => updateSettingsMutation.mutate({ tax })}
          />
          <DeductionsSection 
            settings={settings?.deductions}
            onUpdate={(deductions) => updateSettingsMutation.mutate({ deductions })}
          />
          <OvertimeSection 
            settings={settings?.overtime}
            onUpdate={(overtime) => updateSettingsMutation.mutate({ overtime })}
          />
          <HolidayPTOSection 
            settings={settings?.pto}
            onUpdate={(pto) => updateSettingsMutation.mutate({ pto })}
          />
          <CommissionSection 
            settings={settings?.commission}
            onUpdate={(commission) => updateSettingsMutation.mutate({ commission })}
          />
          <DirectDepositSection />
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollSettings;