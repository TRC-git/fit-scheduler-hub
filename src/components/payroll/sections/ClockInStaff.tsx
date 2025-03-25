
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { differenceInSeconds } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTimeEntries } from "@/hooks/payroll/useTimeEntries";
import { TimeEntryCard } from "./TimeEntryCard";
import { Button } from "@/components/ui/button";

export const ClockInStaff = () => {
  const { toast } = useToast();
  const [runningTimes, setRunningTimes] = useState<{[key: number]: number}>({});
  const { data: clockedInStaff, refetch, isLoading } = useTimeEntries(new Date());

  // Force refetch on component mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (clockedInStaff && clockedInStaff.length > 0) {
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
    try {
      const { error } = await supabase
        .from('timeentries')
        .update({
          clockouttime: new Date().toISOString()
        })
        .eq('timeentryid', timeentryId);

      if (error) {
        console.error('Error clocking out:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Staff member clocked out successfully",
      });
      
      // Force refetch after clock-out
      setTimeout(() => refetch(), 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clock out staff member",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-fitness-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-fitness-text flex items-center gap-2">
          <Clock className="w-5 h-5 text-fitness-accent" />
          Currently Clocked In
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
          className="text-xs"
        >
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-400">Loading active time entries...</p>
          </div>
        ) : (
          <>
            {clockedInStaff && clockedInStaff.length > 0 ? (
              clockedInStaff.map((entry) => (
                <TimeEntryCard
                  key={entry.timeentryid}
                  entry={entry}
                  runningTime={runningTimes[entry.timeentryid] || 0}
                  onClockOut={handleClockOut}
                />
              ))
            ) : (
              <p className="text-center text-gray-400">No staff members currently clocked in</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
