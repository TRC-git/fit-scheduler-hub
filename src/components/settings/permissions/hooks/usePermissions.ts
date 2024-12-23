import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Position, PermissionSettingsType, PositionWithPermissions } from "@/types/permissions";
import { defaultPermissions, convertToJson } from "../utils/permissionUtils";

export const usePermissions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: positions, isLoading } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('*');
      
      if (error) {
        console.error("Error fetching positions:", error);
        throw error;
      }
      
      return (data as Position[]).map(position => ({
        ...position,
        access_level: position.access_level ? {
          ...defaultPermissions,
          ...(position.access_level as unknown as PermissionSettingsType)
        } : defaultPermissions
      }));
    }
  });

  const updateAccessMutation = useMutation({
    mutationFn: async ({ positionId, access }: { positionId: string, access: PermissionSettingsType }) => {
      console.log("Updating permissions for position:", positionId, "with access:", access);
      
      const { data, error } = await supabase
        .from('positions')
        .update({
          access_level: access
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

  const deletePermissionsMutation = useMutation({
    mutationFn: async (positionId: number) => {
      console.log("Resetting permissions for position:", positionId);
      
      const { data, error } = await supabase
        .from('positions')
        .update({
          access_level: defaultPermissions
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

  return {
    positions,
    isLoading,
    updateAccess: updateAccessMutation.mutate,
    deletePermissions: deletePermissionsMutation.mutate
  };
};