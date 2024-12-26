import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useStaffMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updatePayRateMutation = useMutation({
    mutationFn: async ({ 
      employeeId, 
      positionId, 
      payRate 
    }: { 
      employeeId: number; 
      positionId: number; 
      payRate: number 
    }) => {
      console.log('Updating pay rate:', { employeeId, positionId, payRate });
      const { data, error } = await supabase
        .from('employeepositions')
        .update({ 
          payrate: payRate,
          custom_payrate: payRate 
        })
        .eq('employeeid', employeeId)
        .eq('positionid', positionId);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: "Success",
        description: "Pay rate updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating pay rate:', error);
      toast({
        title: "Error",
        description: "Failed to update pay rate",
        variant: "destructive",
      });
    }
  });

  const suspendMutation = useMutation({
    mutationFn: async ({ employeeId, suspend }: { employeeId: number, suspend: boolean }) => {
      const { error } = await supabase
        .from("employees")
        .update({ suspended: suspend })
        .eq("employeeid", employeeId);
      
      if (error) throw error;
    },
    onSuccess: (_, { suspend }) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Success",
        description: `Staff member ${suspend ? 'suspended' : 'resumed'} successfully`,
      });
    },
    onError: (error) => {
      console.error("Error in suspend mutation:", error);
      toast({
        title: "Error",
        description: "Failed to update staff member status",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (employeeId: number) => {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("employeeid", employeeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error in delete mutation:", error);
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
    }
  });

  return {
    updatePayRateMutation,
    suspendMutation,
    deleteMutation
  };
};