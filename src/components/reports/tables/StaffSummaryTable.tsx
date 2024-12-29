import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeHours } from "@/types/reports";

interface StaffSummaryTableProps {
  data: EmployeeHours | null | undefined;
  isLoading: boolean;
}

export const StaffSummaryTable = ({ data, isLoading }: StaffSummaryTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full bg-fitness-grid" />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-4 text-fitness-text">
        No data available for the selected date range
      </div>
    );
  }

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
            <TableCell className="text-fitness-text font-medium">
              Total Scheduled Hours
            </TableCell>
            <TableCell className="text-fitness-text text-right">
              {data.total_scheduled_hours.toFixed(1)}h
            </TableCell>
          </TableRow>
          <TableRow className="border-fitness-grid hover:bg-fitness-inner">
            <TableCell className="text-fitness-text font-medium">
              Total Worked Hours
            </TableCell>
            <TableCell className="text-fitness-text text-right">
              {data.total_worked_hours.toFixed(1)}h
            </TableCell>
          </TableRow>
          <TableRow className="border-fitness-grid hover:bg-fitness-inner">
            <TableCell className="text-fitness-text font-medium">
              Overtime Hours
            </TableCell>
            <TableCell className="text-fitness-text text-right text-fitness-accent">
              {data.total_overtime_hours.toFixed(1)}h
            </TableCell>
          </TableRow>
          <TableRow className="border-fitness-grid hover:bg-fitness-inner">
            <TableCell className="text-fitness-text font-medium">
              Late Clock-ins
            </TableCell>
            <TableCell className="text-fitness-text text-right text-yellow-500">
              {data.late_clock_ins}
            </TableCell>
          </TableRow>
          <TableRow className="border-fitness-grid hover:bg-fitness-inner">
            <TableCell className="text-fitness-text font-medium">
              Missed Clock-ins
            </TableCell>
            <TableCell className="text-fitness-text text-right text-fitness-danger">
              {data.missed_clock_ins}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};