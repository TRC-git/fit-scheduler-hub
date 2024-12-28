import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TaxSettings from "./payroll/sections/TaxSettings";
import DeductionsSettings from "./payroll/sections/DeductionsSettings";
import PTOSettings from "./payroll/sections/PTOSettings";
import CommissionSettings from "./payroll/sections/CommissionSettings";

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
        .eq('email', user?.email)
        .single();

      if (error || !employee) {
        throw new Error('Employee not found');
      }

      return employee.employeeid;
    }
  });

  // Finally, fetch all settings for the employee
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['payrollSettings', employeeId],
    enabled: !!employeeId,
    queryFn: async () => {
      const promises = [
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
      ];

      const [tax, deductions, pto, commission] = await Promise.all(promises);

      return {
        tax: tax.data || {},
        deductions: deductions.data || {},
        pto: pto.data || {},
        commission: commission.data || {},
      };
    }
  });

  const updateSettings = useMutation({
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

      await Promise.all(promises);

      toast({
        title: "Success",
        description: "Settings updated successfully",
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

  const handleSettingChange = (section: string, field: string, value: any) => {
    const sectionData = { ...settings?.[section], [field]: value };
    updateSettings.mutate({ [section]: sectionData });
  };

  if (isLoadingUser || isLoadingEmployee || isLoadingSettings) {
    return <div>Loading...</div>;
  }

  if (!user || !employeeId) {
    return <div>Please log in to access payroll settings.</div>;
  }

  return (
    <div className="space-y-6">
      <TaxSettings
        settings={settings?.tax}
        onSettingChange={(field, value) => handleSettingChange('tax', field, value)}
      />
      <DeductionsSettings
        settings={settings?.deductions}
        onSettingChange={(field, value) => handleSettingChange('deductions', field, value)}
      />
      <PTOSettings
        settings={settings?.pto}
        onSettingChange={(field, value) => handleSettingChange('pto', field, value)}
      />
      <CommissionSettings
        settings={settings?.commission}
        onSettingChange={(field, value) => handleSettingChange('commission', field, value)}
      />
    </div>
  );
};

export default PayrollSettings;