import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStaffQuery = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      console.log("Fetching staff members...");
      try {
        // First check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error("Auth error:", authError);
          throw authError;
        }

        if (!user) {
          throw new Error("User not authenticated");
        }

        // Then fetch staff data
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
            )
          `)
          .eq("isactive", true)
          .order("firstname");
        
        if (staffError) {
          console.error("Error fetching staff:", staffError);
          toast({
            title: "Error",
            description: "Failed to fetch staff members. Please try again.",
            variant: "destructive",
          });
          throw staffError;
        }
        
        console.log("Staff data:", staffData);
        return staffData;
      } catch (error) {
        console.error("Error in staff query:", error);
        toast({
          title: "Error",
          description: "Failed to fetch staff members. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: 3,
  });
};