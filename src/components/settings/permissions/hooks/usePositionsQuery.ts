import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Position, PermissionSettingsType } from "@/types/permissions";
import { defaultPermissions } from "../utils/permissionUtils";

export const usePositionsQuery = () => {
  return useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      console.log("Fetching positions...");
      const { data, error } = await supabase
        .from('positions')
        .select('*');
      
      if (error) {
        console.error("Error fetching positions:", error);
        throw error;
      }
      
      console.log("Positions fetched:", data);
      return (data as Position[]).map(position => ({
        ...position,
        access_level: position.access_level ? {
          ...defaultPermissions,
          ...(position.access_level as unknown as PermissionSettingsType)
        } : defaultPermissions
      }));
    }
  });
};