import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTimeEntries = () => {
  return useQuery({
    queryKey: ['clocked-in-staff'],
    queryFn: async () => {
      console.log("Fetching time entries...");
      const { data, error } = await supabase
        .from('timeentries')
        .select(`
          timeentryid,
          clockintime,
          clockouttime,
          breakduration,
          hoursworked,
          isapproved,
          islate,
          isovertime,
          notes,
          employees (
            employeeid,
            firstname,
            lastname
          ),
          positions (
            positionid,
            positionname
          )
        `)
        .is('clockouttime', null)
        .order('clockintime', { ascending: false });

      if (error) {
        console.error("Error fetching time entries:", error);
        throw error;
      }
      
      console.log("Time entries data:", data);
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};