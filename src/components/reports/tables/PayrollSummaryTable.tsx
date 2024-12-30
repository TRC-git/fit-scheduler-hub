import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Edit2, Lock, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PayrollAdjustmentsForm } from "./components/PayrollAdjustmentsForm";
import { Adjustments, PayrollRecord, PayrollSummaryTableProps } from "./types/payroll";

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
      // First check if there's an existing record
      const { data: existingRecord } = await supabase
        .from('payroll_records')
        .select('*')
        .eq('pay_period_start', dateRange.startDate.toISOString().split('T')[0])
        .eq('pay_period_end', dateRange.endDate.toISOString().split('T')[0])
        .single();

      if (existingRecord) {
        // Safely parse adjustments with default values
        const parsedAdjustments = {
          bonus: Number(existingRecord.adjustments?.bonus) || 0,
          deductions: Number(existingRecord.adjustments?.deductions) || 0,
          comments: existingRecord.adjustments?.comments || "",
        };
        setAdjustments(parsedAdjustments);
        return existingRecord as PayrollRecord;
      }

      // If no existing record, calculate from time entries
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
      // Simplified tax calculation - this should be more sophisticated in production
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
    const adjustedNetPay = adjustedGrossPay * 0.75; // Simplified tax calculation

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

      <div className="rounded-md border border-fitness-grid">
        <Table>
          <TableHeader>
            <TableRow className="border-fitness-grid hover:bg-fitness-inner">
              <TableHead className="text-fitness-text">Metric</TableHead>
              <TableHead className="text-fitness-text text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-fitness-grid hover:bg-fitness-inner">
              <TableCell className="text-fitness-text font-medium">
                Total Hours
              </TableCell>
              <TableCell className="text-fitness-text text-right">
                {payrollRecord.total_hours.toFixed(1)}h
              </TableCell>
            </TableRow>
            <TableRow className="border-fitness-grid hover:bg-fitness-inner">
              <TableCell className="text-fitness-text font-medium">
                Overtime Hours
              </TableCell>
              <TableCell className="text-fitness-text text-right">
                {payrollRecord.total_overtime_hours.toFixed(1)}h
              </TableCell>
            </TableRow>
            <TableRow className="border-fitness-grid hover:bg-fitness-inner">
              <TableCell className="text-fitness-text font-medium">
                Gross Pay
              </TableCell>
              <TableCell className="text-fitness-text text-right">
                ${payrollRecord.gross_pay.toFixed(2)}
              </TableCell>
            </TableRow>
            {editMode ? (
              <PayrollAdjustmentsForm 
                adjustments={adjustments}
                onChange={setAdjustments}
              />
            ) : (
              <>
                <TableRow className="border-fitness-grid hover:bg-fitness-inner">
                  <TableCell className="text-fitness-text font-medium">
                    Bonus
                  </TableCell>
                  <TableCell className="text-fitness-text text-right">
                    ${adjustments.bonus.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow className="border-fitness-grid hover:bg-fitness-inner">
                  <TableCell className="text-fitness-text font-medium">
                    Deductions
                  </TableCell>
                  <TableCell className="text-fitness-text text-right">
                    ${adjustments.deductions.toFixed(2)}
                  </TableCell>
                </TableRow>
                {adjustments.comments && (
                  <TableRow className="border-fitness-grid hover:bg-fitness-inner">
                    <TableCell className="text-fitness-text font-medium">
                      Comments
                    </TableCell>
                    <TableCell className="text-fitness-text text-right">
                      {adjustments.comments}
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
            <TableRow className="border-fitness-grid hover:bg-fitness-inner">
              <TableCell className="text-fitness-text font-medium">
                Net Pay
              </TableCell>
              <TableCell className="text-fitness-text text-right">
                ${payrollRecord.net_pay.toFixed(2)}
              </TableCell>
            </TableRow>
            <TableRow className="border-fitness-grid hover:bg-fitness-inner">
              <TableCell className="text-fitness-text font-medium">
                Status
              </TableCell>
              <TableCell className="text-fitness-text text-right">
                {payrollRecord.status === 'finalized' ? (
                  <span className="text-green-500">Finalized</span>
                ) : (
                  <span className="text-yellow-500">Draft</span>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};