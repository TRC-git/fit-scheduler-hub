import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DirectDepositInfo } from "@/types/database/direct-deposit";

export const useDirectDeposit = () => {
  const { toast } = useToast();

  const { data: employeeData } = useQuery({
    queryKey: ['currentEmployee'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('employeeid')
        .eq('email', (await supabase.auth.getUser()).data.user?.email)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: directDepositInfo } = useQuery({
    queryKey: ['directDepositInfo', employeeData?.employeeid],
    enabled: !!employeeData?.employeeid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('direct_deposit_info')
        .select('*')
        .eq('employee_id', employeeData.employeeid)
        .maybeSingle();
      
      if (error) throw error;
      return data as DirectDepositInfo;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async ({ formData, file }: { formData: FormData, file: File | null }) => {
      if (!employeeData?.employeeid) {
        throw new Error('Employee not found');
      }

      let filePath = directDepositInfo?.form_file_path;

      if (file) {
        const fileExt = file.name.split('.').pop();
        filePath = `${employeeData.employeeid}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('direct_deposit_forms')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
      }

      const { error: dbError } = await supabase
        .from('direct_deposit_info')
        .upsert({
          employee_id: employeeData.employeeid,
          bank_name: formData.get('bankName'),
          account_type: formData.get('accountType'),
          routing_number: formData.get('routingNumber'),
          account_number: formData.get('accountNumber'),
          form_file_path: filePath,
          is_verified: false
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Direct deposit information saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save direct deposit information",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  return {
    employeeData,
    directDepositInfo,
    saveMutation
  };
};