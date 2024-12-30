import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Edit2, Lock, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PayrollDetailsTable } from "./components/PayrollDetailsTable";
import { Adjustments, PayrollRecord, PayrollSummaryTableProps } from "./types/payroll";
import { Json } from "@/types/database/common";

export const PayrollSummaryTable = ({ dateRange, selectedEmployee }: PayrollSummaryTableProps) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [adjustments, setAdjustments] = useState<Adjustments>({
    bonus: 0,
    deductions: 0,
    comments: "",
  });

  const { data: payrollRecord, isLoading, refetch } = useQuery({
    queryKey: ['payroll-summary', dateRange.startDate, dateRange.endDate, selectedEmployee],
    queryFn: async () => {
      const { data: existingRecord } = await supabase
        .from('payroll_records')
        .select('*')
        .eq('pay_period_start', dateRange.startDate.toISOString().split('T')[0])
        .eq('pay_period_end', dateRange.endDate.toISOString().split('T')[0])
        .single();

      if (existingRecord) {
        const parsedAdjustments: Adjustments = {
          bonus: Number((existingRecord.adjustments as Json as any)?.bonus) || 0,
          deductions: Number((existingRecord.adjustments as Json as any)?.deductions) || 0,
          comments: String((existingRecord.adjustments as Json as any)?.comments || ""),
        };
        setAdjustments(parsedAdjustments);
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
        .gte('clockintime', dateRange.startDate.toISOString())
        .lte('clockintime', dateRange.endDate.toISOString())
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
        pay_period_start: dateRange.startDate.toISOString().split('T')[0],
        pay_period_end: dateRange.endDate.toISOString().split('T')[0],
        total_hours: totalHours,
        total_overtime_hours: overtimeHours,
        gross_pay: grossPay,
        net_pay: netPay,
        status: 'draft' as const,
        adjustments: { bonus: 0, deductions: 0, comments: "" }
      } as PayrollRecord;
    }
  });

  const handleSave = async () => {
    if (!payrollRecord) return;

    const adjustedGrossPay = payrollRecord.gross_pay + adjustments.bonus - adjustments.deductions;
    const adjustedNetPay = adjustedGrossPay * 0.75;

    const { error } = await supabase
      .from('payroll_records')
      .upsert({
        pay_period_start: payrollRecord.pay_period_start,
        pay_period_end: payrollRecord.pay_period_end,
        total_hours: payrollRecord.total_hours,
        total_overtime_hours: payrollRecord.total_overtime_hours,
        gross_pay: adjustedGrossPay,
        net_pay: adjustedNetPay,
        status: 'draft',
        adjustments: adjustments as unknown as Json
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save payroll adjustments",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Payroll adjustments saved successfully"
      });
      setEditMode(false);
      refetch();
    }
  };

  const handleFinalize = async () => {
    if (!payrollRecord) return;

    const { error } = await supabase
      .from('payroll_records')
      .update({ status: 'finalized' })
      .eq('pay_period_start', payrollRecord.pay_period_start)
      .eq('pay_period_end', payrollRecord.pay_period_end);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to finalize payroll",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Payroll has been finalized"
      });
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full bg-fitness-grid" />
        ))}
      </div>
    );
  }

  if (!payrollRecord) {
    return (
      <div className="text-center py-4 text-fitness-text">
        No payroll data available for the selected date range
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        {payrollRecord.status === 'draft' && (
          <>
            <Button
              variant="outline"
              onClick={() => setEditMode(!editMode)}
              className="bg-fitness-inner text-fitness-text"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editMode ? "Cancel Edit" : "Edit"}
            </Button>
            {editMode && (
              <Button
                onClick={handleSave}
                className="bg-fitness-accent text-black hover:bg-fitness-accent/80"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            )}
            <Button
              onClick={handleFinalize}
              className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-black"
            >
              <Lock className="w-4 h-4 mr-2" />
              Finalize Payroll
            </Button>
          </>
        )}
      </div>

      <PayrollDetailsTable
        payrollRecord={payrollRecord}
        adjustments={adjustments}
        editMode={editMode}
        onAdjustmentsChange={setAdjustments}
      />
    </div>
  );
};