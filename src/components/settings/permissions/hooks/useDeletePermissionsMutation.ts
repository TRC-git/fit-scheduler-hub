import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { defaultPermissions, convertToJson } from "../utils/permissionUtils";

export const useDeletePermissionsMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (positionId: number) => {
      console.log("Resetting permissions for position:", positionId);
      
      const { data, error } = await supabase
        .from('positions')
        .update({
          access_level: convertToJson(defaultPermissions)
        })
        .eq('positionid', positionId)
        .select();
      
      if (error) {
        console.error("Error resetting permissions:", error);
        throw error;
      }
      
      console.log("Reset response:", data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position permissions reset successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
    onError: (error) => {
      console.error("Error in deletePermissionsMutation:", error);
      toast({
        title: "Error",
        description: "Failed to reset permissions. Please try again.",
        variant: "destructive"
      });
    }
  });
};