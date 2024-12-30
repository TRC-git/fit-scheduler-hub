import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { format, differenceInSeconds } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export const ClockInStaff = () => {
  const { toast } = useToast();
  const [runningTimes, setRunningTimes] = useState<{[key: number]: number}>({});

  const { data: clockedInStaff, refetch } = useQuery({
    queryKey: ['clocked-in-staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timeentries')
        .select(`
          *,
          employees (
            firstname,
            lastname,
            employeeid
          ),
          positions (
            positionname
          )
        `)
        .is('clockouttime', null)
        .order('clockintime', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

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

  const formatRunningTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
          <div
            key={entry.timeentryid}
            className="flex items-center justify-between p-4 rounded-lg bg-[#202020]"
          >
            <div className="space-y-1">
              <p className="text-fitness-text font-medium">
                {entry.employees?.firstname} {entry.employees?.lastname}
              </p>
              <p className="text-sm text-gray-400">
                {entry.positions?.positionname}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-fitness-accent">
                  In: {format(new Date(entry.clockintime), 'hh:mm a')}
                </span>
                <span className="flex items-center gap-1 text-fitness-accent">
                  <Timer className="w-4 h-4" />
                  {formatRunningTime(runningTimes[entry.timeentryid] || 0)}
                </span>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={() => handleClockOut(entry.timeentryid)}
            >
              Clock Out
            </Button>
          </div>
        ))}
        {(!clockedInStaff || clockedInStaff.length === 0) && (
          <p className="text-center text-gray-400">No staff members currently clocked in</p>
        )}
      </CardContent>
    </Card>
  );
};