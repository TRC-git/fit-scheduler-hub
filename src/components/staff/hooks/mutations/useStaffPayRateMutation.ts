import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useStaffPayRateMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ employeeId, positionId, payRate }: { 
      employeeId: number;
      positionId: number;
      payRate: number;
    }) => {
      const { error } = await supabase
        .from('employeepositions')
        .update({ payrate: payRate })
        .eq('employeeid', employeeId)
        .eq('positionid', positionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: "Success",
        description: "Pay rate updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update pay rate",
        variant: "destructive",
      });
    },
  });
};