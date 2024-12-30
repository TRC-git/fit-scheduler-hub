import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Clock, DollarSign, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const PayrollReports = () => {
  const { data: reports } = useQuery({
    queryKey: ['payroll-reports'],
    queryFn: async () => {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      
      const { data: timeEntries, error } = await supabase
        .from('timeentries')
        .select(`
          *,
          employees (
            firstname,
            lastname
          ),
          positions (
            positionname
          )
        `)
        .gte('clockintime', startOfWeek.toISOString())
        .order('clockintime', { ascending: false });

      if (error) throw error;

      // Calculate weekly stats
      let totalHours = 0;
      let overtimeHours = 0;
      let lateArrivals = 0;

      timeEntries?.forEach(entry => {
        if (entry.hoursworked) {
          totalHours += entry.hoursworked;
          if (entry.isovertime) {
            overtimeHours += entry.hoursworked;
          }
        }
        if (entry.islate) {
          lateArrivals++;
        }
      });

      return {
        totalHours,
        overtimeHours,
        lateArrivals,
        uniqueEmployees: new Set(timeEntries?.map(e => e.employeeid)).size
      };
    }
  });

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text flex items-center gap-2">
          <BarChart className="w-5 h-5 text-fitness-accent" />
          Weekly Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#202020]">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-fitness-accent" />
              <span className="text-sm text-gray-400">Total Hours</span>
            </div>
            <p className="text-xl font-bold text-fitness-text">
              {reports?.totalHours.toFixed(1)}h
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#202020]">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-fitness-accent" />
              <span className="text-sm text-gray-400">Overtime</span>
            </div>
            <p className="text-xl font-bold text-fitness-text">
              {reports?.overtimeHours.toFixed(1)}h
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#202020]">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-fitness-accent" />
              <span className="text-sm text-gray-400">Active Staff</span>
            </div>
            <p className="text-xl font-bold text-fitness-text">
              {reports?.uniqueEmployees || 0}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#202020]">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-400">Late Arrivals</span>
            </div>
            <p className="text-xl font-bold text-fitness-text">
              {reports?.lateArrivals || 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};