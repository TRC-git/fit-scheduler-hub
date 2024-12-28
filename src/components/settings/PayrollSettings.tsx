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

  // First, ensure we have a valid authenticated user
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) throw new Error('Authentication required');
      return user;
    }
  });

  // Then, get the employee ID for the authenticated user
  const { data: employeeId, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ['currentEmployee', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data: employee, error } = await supabase
        .from('employees')
        .select('employeeid')
        .eq('email', user.email)
        .single();
      
      if (error) throw error;
      if (!employee) throw new Error('No employee found');
      
      return employee.employeeid;
    }
  });

  // Finally, fetch all settings for the employee
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
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
      if (!employeeId) throw new Error('No employee ID found');
      
      const timestamp = new Date().toISOString();
      const promises = [];
      
      if (updates.tax) {
        promises.push(
          supabase
            .from('tax_withholding_settings')
            .upsert({ 
              ...updates.tax, 
              employee_id: employeeId,
              updated_at: timestamp,
              created_at: timestamp // Add for new records
            })
        );
      }
      
      if (updates.deductions) {
        promises.push(
          supabase
            .from('employee_deductions')
            .upsert({ 
              ...updates.deductions, 
              employee_id: employeeId,
              updated_at: timestamp,
              created_at: timestamp // Add for new records
            })
        );
      }
      
      if (updates.pto) {
        promises.push(
          supabase
            .from('pto_holiday_settings')
            .upsert({ 
              ...updates.pto, 
              employee_id: employeeId,
              updated_at: timestamp,
              created_at: timestamp // Add for new records
            })
        );
      }
      
      if (updates.commission) {
        promises.push(
          supabase
            .from('commission_bonus_settings')
            .upsert({ 
              ...updates.commission, 
              employee_id: employeeId,
              updated_at: timestamp,
              created_at: timestamp // Add for new records
            })
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
        description: "Failed to update payroll settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  if (isLoadingUser || isLoadingEmployee || isLoadingSettings) {
    return <div>Loading...</div>;
  }

  if (!user || !employeeId) {
    return <div>Please log in to access payroll settings.</div>;
  }

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