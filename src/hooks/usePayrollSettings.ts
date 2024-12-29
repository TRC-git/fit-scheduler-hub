import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const usePayrollSettings = () => {
  const { toast } = useToast();

  const { data: employeeData, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ['currentEmployee'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('No authenticated user found');
      
      const { data: employee, error } = await supabase
        .from('employees')
        .select('employeeid')
        .eq('email', user.email)
        .maybeSingle();
      
      if (error) throw error;
      if (!employee) return null;
      
      return employee;
    }
  });

  const employeeId = employeeData?.employeeid;

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['payrollSettings', employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      if (!employeeId) throw new Error('No employee ID available');
      
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
      if (!employeeId) {
        throw new Error('No employee ID found. Please try again later.');
      }
      
      const promises = [];
      
      if (updates.tax) {
        promises.push(
          supabase
            .from('tax_withholding_settings')
            .upsert({ 
              ...updates.tax, 
              employee_id: employeeId,
              updated_at: new Date().toISOString()
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
              updated_at: new Date().toISOString()
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
              updated_at: new Date().toISOString()
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
              updated_at: new Date().toISOString()
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

      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error).map(r => r.error);
      
      if (errors.length > 0) {
        console.error('Errors updating settings:', errors);
        throw new Error('Failed to update some settings. Please try again.');
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payroll settings updated successfully",
      });
    },
    onError: (error: Error) => {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update payroll settings",
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