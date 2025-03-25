
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
      
      // Create a single defaultPermissions object for reference
      const basePermissions = { ...defaultPermissions };
      
      // Map positions with proper access_level formatting
      return (data as any[]).map(position => {
        // If access_level exists, merge with defaultPermissions
        const accessLevel = position.access_level 
          ? { ...basePermissions, ...(position.access_level as PermissionSettingsType) }
          : { ...basePermissions };
          
        // Return position with properly formatted access_level
        return {
          ...position,
          access_level: accessLevel
        };
      }) as Position[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false // Don't refetch on window focus for better performance
  });
};
