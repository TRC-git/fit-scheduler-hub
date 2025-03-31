
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTimeEntries = (startDate: Date = new Date()) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['timeEntries', startDate],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('No valid session found');
      }

      console.log("Fetching time entries since:", startDate.toISOString());

      const { data, error } = await supabase
        .from('timeentries')
        .select(`
          timeentryid,
          clockintime,
          clockouttime,
          breakduration,
          employeeid,
          positionid,
          employees!timeentries_employeeid_fkey (
            firstname,
            lastname
          ),
          positions (
            positionname
          )
        `)
        .is('clockouttime', null)  // Only get entries without clockout time
        .gte('clockintime', new Date(startDate.setHours(0, 0, 0, 0)).toISOString())
        .order('clockintime', { ascending: false });

      if (error) {
        console.error('Error fetching time entries:', error);
        throw error;
      }

      console.log("Retrieved time entries:", data);
      return data;
    },
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch time entries. Please try again.",
          variant: "destructive",
        });
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};
