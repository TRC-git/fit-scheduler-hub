import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useStaffQuery = () => {
  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      console.log("Fetching staff members...");
      try {
        const { data: staffData, error: staffError } = await supabase
          .from("employees")
          .select(`
            *,
            employeepositions (
              payrate,
              is_primary,
              positions (
                positionid,
                positionname,
                access_level,
                defaultpayrate
              )
            ),
            positions:employees_position_id_fkey (
              positionid,
              positionname
            )
          `)
          .eq("isactive", true)
          .order("firstname");
        
        if (staffError) {
          console.error("Error fetching staff:", staffError);
          throw staffError;
        }
        
        console.log("Staff data:", staffData);
        return staffData;
      } catch (error) {
        console.error("Error in staff query:", error);
        throw error;
      }
    },
    staleTime: 0, // Consider data stale immediately
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};