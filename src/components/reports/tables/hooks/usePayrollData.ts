import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PayrollRecord, Adjustments } from "../types/payroll";
import { Json } from "@/types/database/common";

export const usePayrollData = (
  startDate: Date,
  endDate: Date,
  selectedEmployee?: number
) => {
  return useQuery({
    queryKey: ['payroll-summary', startDate, endDate, selectedEmployee],
    queryFn: async () => {
      const { data: existingRecord } = await supabase
        .from('payroll_records')
        .select('*')
        .eq('pay_period_start', startDate.toISOString().split('T')[0])
        .eq('pay_period_end', endDate.toISOString().split('T')[0])
        .single();

      if (existingRecord) {
        const parsedAdjustments: Adjustments = {
          bonus: Number((existingRecord.adjustments as Json as any)?.bonus) || 0,
          deductions: Number((existingRecord.adjustments as Json as any)?.deductions) || 0,
          comments: String((existingRecord.adjustments as Json as any)?.comments || ""),
        };
        
        return {
          ...existingRecord,
          adjustments: parsedAdjustments
        } as PayrollRecord;
      }

      // Calculate from time entries if no existing record
      const { data: timeEntries } = await supabase
        .from('timeentries')
        .select(`
          *,
          employees!timeentries_employeeid_fkey (
            employeepositions (
              payrate
            )
          )
        `)
        .gte('clockintime', startDate.toISOString())
        .lte('clockintime', endDate.toISOString())
        .eq('employeeid', selectedEmployee || undefined);

      if (!timeEntries?.length) return null;

      const totalHours = timeEntries.reduce((sum, entry) => sum + (entry.hoursworked || 0), 0);
      const overtimeHours = timeEntries.reduce((sum, entry) => 
        sum + (entry.isovertime ? (entry.hoursworked || 0) : 0), 0);
      const regularHours = totalHours - overtimeHours;

      const basePayRate = timeEntries[0]?.employees?.employeepositions[0]?.payrate || 0;
      const overtimeRate = basePayRate * 1.5;

      const grossPay = (regularHours * basePayRate) + (overtimeHours * overtimeRate);
      const netPay = grossPay * 0.75;

      return {
        pay_period_start: startDate.toISOString().split('T')[0],
        pay_period_end: endDate.toISOString().split('T')[0],
        total_hours: totalHours,
        total_overtime_hours: overtimeHours,
        gross_pay: grossPay,
        net_pay: netPay,
        status: 'draft' as const,
        adjustments: { bonus: 0, deductions: 0, comments: "" }
      } as PayrollRecord;
    }
  });
};