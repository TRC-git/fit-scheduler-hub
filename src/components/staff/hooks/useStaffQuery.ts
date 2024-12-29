import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStaffQuery = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      console.log("Fetching staff with positions...");
      const { data, error } = await supabase
        .from("employees")
        .select(`
          *,
          positions!employees_position_id_fkey (*),
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
        toast({
          title: "Error fetching staff",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log("Staff data:", data);
      return data;
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};