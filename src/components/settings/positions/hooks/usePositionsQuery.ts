import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Position } from "../types";

export const usePositionsQuery = () => {
  return useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      console.log('Fetching positions...');
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .returns<Position[]>();
      
      if (error) {
        console.error('Error fetching positions:', error);
        throw error;
      }
      
      console.log('Positions fetched:', data);
      return data || [];
    }
  });
};