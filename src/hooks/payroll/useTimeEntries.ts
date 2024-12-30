import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TimeEntry {
  timeentryid: number;
  clockintime: string;
  clockouttime: string | null;
  employees: {
    firstname: string;
    lastname: string;
  };
  positions: {
    positionname: string;
  };
}

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
          employees!timeentries_employeeid_fkey (
            firstname,
            lastname
          ),
          positions!timeentries_positionid_fkey (
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
      return data as TimeEntry[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};