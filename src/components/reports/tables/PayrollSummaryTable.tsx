import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { PayrollDetailsTable } from "./components/PayrollDetailsTable";
import { PayrollActions } from "./components/PayrollActions";
import { Adjustments, PayrollSummaryTableProps } from "./types/payroll";
import { usePayrollData } from "./hooks/usePayrollData";
import { usePayrollMutations } from "./hooks/usePayrollMutations";

export const PayrollSummaryTable = ({ dateRange, selectedEmployee }: PayrollSummaryTableProps) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [adjustments, setAdjustments] = useState<Adjustments>({
    bonus: 0,
    deductions: 0,
    comments: "",
  });

  const { data: payrollRecord, isLoading, refetch } = usePayrollData(
    dateRange.startDate,
    dateRange.endDate,
    selectedEmployee
  );

  const { savePayroll, finalizePayroll } = usePayrollMutations();

  const handleSave = async () => {
    if (!payrollRecord) return;

    const { error } = await savePayroll(payrollRecord, adjustments);

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

    const { error } = await finalizePayroll(payrollRecord);

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
      <PayrollActions
        status={payrollRecord.status}
        editMode={editMode}
        onEditToggle={() => setEditMode(!editMode)}
        onSave={handleSave}
        onFinalize={handleFinalize}
      />

      <PayrollDetailsTable
        payrollRecord={payrollRecord}
        adjustments={adjustments}
        editMode={editMode}
        onAdjustmentsChange={setAdjustments}
      />
    </div>
  );
};