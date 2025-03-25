
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { PermissionSettingsType } from "@/types/permissions";
import { convertToJson } from "../utils/permissionUtils";

export const useUpdatePermissionsMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ positionId, access }: { positionId: number, access: PermissionSettingsType }) => {
      console.log("Updating permissions for position:", positionId, "with access:", access);
      
      const jsonAccess = convertToJson(access);
      console.log("Converted access to JSON:", jsonAccess);
      
      const { data, error } = await supabase
        .from('positions')
        .update({
          access_level: jsonAccess
        })
        .eq('positionid', positionId)
        .select();
      
      if (error) {
        console.error("Error updating permissions:", error);
        throw error;
      }
      
      console.log("Update response:", data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position permissions updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
    onError: (error) => {
      console.error("Error in updateAccessMutation:", error);
      toast({
        title: "Error",
        description: "Failed to update permissions. Please try again.",
        variant: "destructive"
      });
    }
  });
};
