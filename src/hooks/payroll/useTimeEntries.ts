import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTimeEntries = () => {
  return useQuery({
    queryKey: ['clocked-in-staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timeentries')
        .select(`
          timeentryid,
          clockintime,
          clockouttime,
          employees!timeentries_employeeid_fkey (
            employeeid,
            firstname,
            lastname
          ),
          positions!timeentries_positionid_fkey (
            positionid,
            positionname
          )
        `)
        .is('clockouttime', null)
        .order('clockintime', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
};