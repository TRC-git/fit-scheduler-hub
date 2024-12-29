import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const usePayrollSettings = () => {
  const { toast } = useToast();

  const { data: employeeId, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ['currentEmployee'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data: employee } = await supabase
        .from('employees')
        .select('employeeid')
        .eq('email', user.email)
        .maybeSingle();
      
      if (!employee?.employeeid) return null;
      return employee.employeeid;
    }
  });

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['payrollSettings', employeeId],
    enabled: typeof employeeId === 'number',
    queryFn: async () => {
      console.log('Fetching settings for employee:', employeeId);
      
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
          .maybeSingle(),
        supabase
          .from('employee_deductions')
          .select('*')
          .eq('employee_id', employeeId)
          .maybeSingle(),
        supabase
          .from('pto_holiday_settings')
          .select('*')
          .eq('employee_id', employeeId)
          .maybeSingle(),
        supabase
          .from('commission_bonus_settings')
          .select('*')
          .eq('employee_id', employeeId)
          .maybeSingle(),
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
      if (typeof employeeId !== 'number') throw new Error('No employee ID found');
      
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

  return {
    employeeId,
    settings,
    isLoadingEmployee,
    isLoadingSettings,
    updateSettingsMutation
  };
};