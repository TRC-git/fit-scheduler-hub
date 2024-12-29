import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStaffQuery = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      console.log("Fetching staff with positions...");
      const { data, error } = await supabase
        .from("employees")
        .select(`
          *,
          positions (*),
          employeepositions (
            is_primary,
            positions (
              positionid,
              positionname
            )
          )
        `)
        .eq("isactive", true)
        .order("firstname");

      if (error) {
        console.error("Error fetching staff:", error);
        throw error;
      }

      console.log("Staff data:", data);
      return data;
    },
  });
};