import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { differenceInSeconds } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTimeEntries } from "@/hooks/payroll/useTimeEntries";
import { TimeEntryCard } from "./TimeEntryCard";

export const ClockInStaff = () => {
  const { toast } = useToast();
  const [runningTimes, setRunningTimes] = useState<{[key: number]: number}>({});
  const { data: clockedInStaff, refetch } = useTimeEntries(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      if (clockedInStaff) {
        const newRunningTimes = { ...runningTimes };
        clockedInStaff.forEach(entry => {
          const seconds = differenceInSeconds(new Date(), new Date(entry.clockintime));
          newRunningTimes[entry.timeentryid] = seconds;
        });
        setRunningTimes(newRunningTimes);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [clockedInStaff]);

  const handleClockOut = async (timeentryId: number) => {
    const { error } = await supabase
      .from('timeentries')
      .update({
        clockouttime: new Date().toISOString()
      })
      .eq('timeentryid', timeentryId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to clock out staff member",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Staff member clocked out successfully",
      });
      refetch();
    }
  };

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text flex items-center gap-2">
          <Clock className="w-5 h-5 text-fitness-accent" />
          Currently Clocked In
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {clockedInStaff?.map((entry) => (
          <TimeEntryCard
            key={entry.timeentryid}
            entry={entry}
            runningTime={runningTimes[entry.timeentryid] || 0}
            onClockOut={handleClockOut}
          />
        ))}
        {(!clockedInStaff || clockedInStaff.length === 0) && (
          <p className="text-center text-gray-400">No staff members currently clocked in</p>
        )}
      </CardContent>
    </Card>
  );
};