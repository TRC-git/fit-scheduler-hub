import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PayrollRecord, Adjustments } from "../types/payroll";
import { PayrollAdjustmentsForm } from "./PayrollAdjustmentsForm";

interface PayrollDetailsTableProps {
  payrollRecord: PayrollRecord;
  adjustments: Adjustments;
  editMode: boolean;
  onAdjustmentsChange: (adjustments: Adjustments) => void;
}

export const PayrollDetailsTable = ({ 
  payrollRecord, 
  adjustments, 
  editMode, 
  onAdjustmentsChange 
}: PayrollDetailsTableProps) => {
  return (
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
            <TableCell className="text-fitness-text font-medium">Total Hours</TableCell>
            <TableCell className="text-fitness-text text-right">
              {payrollRecord.total_hours.toFixed(1)}h
            </TableCell>
          </TableRow>
          <TableRow className="border-fitness-grid hover:bg-fitness-inner">
            <TableCell className="text-fitness-text font-medium">Overtime Hours</TableCell>
            <TableCell className="text-fitness-text text-right">
              {payrollRecord.total_overtime_hours.toFixed(1)}h
            </TableCell>
          </TableRow>
          <TableRow className="border-fitness-grid hover:bg-fitness-inner">
            <TableCell className="text-fitness-text font-medium">Gross Pay</TableCell>
            <TableCell className="text-fitness-text text-right">
              ${payrollRecord.gross_pay.toFixed(2)}
            </TableCell>
          </TableRow>
          {editMode ? (
            <PayrollAdjustmentsForm 
              adjustments={adjustments}
              onChange={onAdjustmentsChange}
            />
          ) : (
            <>
              <TableRow className="border-fitness-grid hover:bg-fitness-inner">
                <TableCell className="text-fitness-text font-medium">Bonus</TableCell>
                <TableCell className="text-fitness-text text-right">
                  ${adjustments.bonus.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow className="border-fitness-grid hover:bg-fitness-inner">
                <TableCell className="text-fitness-text font-medium">Deductions</TableCell>
                <TableCell className="text-fitness-text text-right">
                  ${adjustments.deductions.toFixed(2)}
                </TableCell>
              </TableRow>
              {adjustments.comments && (
                <TableRow className="border-fitness-grid hover:bg-fitness-inner">
                  <TableCell className="text-fitness-text font-medium">Comments</TableCell>
                  <TableCell className="text-fitness-text text-right">
                    {adjustments.comments}
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
          <TableRow className="border-fitness-grid hover:bg-fitness-inner">
            <TableCell className="text-fitness-text font-medium">Net Pay</TableCell>
            <TableCell className="text-fitness-text text-right">
              ${payrollRecord.net_pay.toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow className="border-fitness-grid hover:bg-fitness-inner">
            <TableCell className="text-fitness-text font-medium">Status</TableCell>
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
  );
};