import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useStaffSuspendMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ employeeId, suspend }: { 
      employeeId: number;
      suspend: boolean;
    }) => {
      const { error } = await supabase
        .from('employees')
        .update({ suspended: suspend })
        .eq('employeeid', employeeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: "Success",
        description: "Employee status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update employee status",
        variant: "destructive",
      });
    },
  });
};