import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeHours, PositionScheduleSummary, EmployeeAttendanceSummary } from "@/types/reports";
import { format } from "date-fns";

export const useReports = (startDate: Date, endDate: Date, employeeId?: number) => {
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');

  const employeeHoursQuery = useQuery({
    queryKey: ['employeeHours', employeeId, formattedStartDate, formattedEndDate],
    queryFn: async () => {
      if (!employeeId) return null;
      
      const { data, error } = await supabase
        .rpc('calculate_employee_hours', {
          employee_id: employeeId,
          start_date: formattedStartDate,
          end_date: formattedEndDate
        }) as { data: EmployeeHours | null, error: any };

      if (error) throw error;
      return data;
    },
    enabled: !!employeeId
  });

  const positionSummaryQuery = useQuery({
    queryKey: ['positionSummary', formattedStartDate, formattedEndDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_position_schedule_summary', {
          start_date: formattedStartDate,
          end_date: formattedEndDate
        }) as { data: PositionScheduleSummary[] | null, error: any };

      if (error) throw error;
      return data || [];
    }
  });

  const attendanceSummaryQuery = useQuery({
    queryKey: ['attendanceSummary', formattedStartDate, formattedEndDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_employee_attendance_summary', {
          start_date: formattedStartDate,
          end_date: formattedEndDate
        }) as { data: EmployeeAttendanceSummary[] | null, error: any };

      if (error) throw error;
      return data || [];
    }
  });

  return {
    employeeHours: employeeHoursQuery.data,
    isLoadingEmployeeHours: employeeHoursQuery.isLoading,
    positionSummary: positionSummaryQuery.data,
    isLoadingPositionSummary: positionSummaryQuery.isLoading,
    attendanceSummary: attendanceSummaryQuery.data,
    isLoadingAttendanceSummary: attendanceSummaryQuery.isLoading,
  };
};