import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Position, PermissionSettings, PositionWithPermissions } from "@/types/permissions";
import { defaultPermissions, convertToJson } from "../utils/permissionUtils";

export const usePermissions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: positions, isLoading } = useQuery<PositionWithPermissions[]>({
    queryKey: ['positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('*');
      
      if (error) throw error;
      
      return (data as Position[]).map(position => ({
        ...position,
        access_level: position.access_level ? {
          ...defaultPermissions,
          ...(position.access_level as unknown as PermissionSettings)
        } : defaultPermissions
      }));
    }
  });

  const updateAccessMutation = useMutation({
    mutationFn: async ({ positionId, access }: { positionId: string, access: PermissionSettings }) => {
      const { data, error } = await supabase
        .from('positions')
        .update({
          access_level: convertToJson(access)
        })
        .eq('positionid', positionId);
      
      if (error) throw error;
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
      toast({
        title: "Error",
        description: "Failed to update permissions. Please try again.",
        variant: "destructive"
      });
      console.error("Error updating permissions:", error);
    }
  });

  const deletePermissionsMutation = useMutation({
    mutationFn: async (positionId: number) => {
      const { data, error } = await supabase
        .from('positions')
        .update({
          access_level: convertToJson(defaultPermissions)
        })
        .eq('positionid', positionId);
      
      if (error) throw error;
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
      toast({
        title: "Error",
        description: "Failed to reset permissions. Please try again.",
        variant: "destructive"
      });
      console.error("Error resetting permissions:", error);
    }
  });

  return {
    positions,
    isLoading,
    updateAccess: updateAccessMutation.mutate,
    deletePermissions: deletePermissionsMutation.mutate
  };
};