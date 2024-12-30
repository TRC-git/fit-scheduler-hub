import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const PayrollSummary = () => {
  const { data: summary } = useQuery({
    queryKey: ['payroll-summary'],
    queryFn: async () => {
      // Get scheduled hours and estimated payroll
      const { data: schedules, error: schedulesError } = await supabase
        .from('schedules')
        .select(`
          *,
          employeepositions!inner (
            payrate
          )
        `)
        .gte('shiftdate', new Date().toISOString())
        .lte('shiftdate', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

      if (schedulesError) throw schedulesError;

      let totalHours = 0;
      let totalPayroll = 0;

      schedules?.forEach(schedule => {
        const hours = new Date(`2000-01-01T${schedule.endtime}`).getHours() - 
                     new Date(`2000-01-01T${schedule.starttime}`).getHours();
        totalHours += hours;
        totalPayroll += hours * (schedule.employeepositions?.payrate || 0);
      });

      return {
        scheduledHours: totalHours,
        estimatedPayroll: totalPayroll
      };
    }
  });

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-fitness-accent" />
          Payroll Summary (Next 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#202020]">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-fitness-accent" />
              <span className="text-fitness-text">Total Hours Scheduled</span>
            </div>
            <span className="text-xl font-bold text-fitness-text">
              {summary?.scheduledHours || 0}h
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-[#202020]">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-fitness-accent" />
              <span className="text-fitness-text">Est. Total Payroll</span>
            </div>
            <span className="text-xl font-bold text-fitness-text">
              ${summary?.estimatedPayroll.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};