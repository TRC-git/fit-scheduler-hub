import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeAttendanceSummary } from "@/types/reports";

interface AttendanceSummaryTableProps {
  data: EmployeeAttendanceSummary[] | undefined;
  isLoading: boolean;
}

export const AttendanceSummaryTable = ({ data, isLoading }: AttendanceSummaryTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full bg-fitness-grid" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-fitness-grid">
      <Table>
        <TableHeader>
          <TableRow className="border-fitness-grid hover:bg-fitness-inner">
            <TableHead className="text-fitness-text">Employee</TableHead>
            <TableHead className="text-fitness-text">Position</TableHead>
            <TableHead className="text-fitness-text text-right">Scheduled</TableHead>
            <TableHead className="text-fitness-text text-right">Completed</TableHead>
            <TableHead className="text-fitness-text text-right">Missed</TableHead>
            <TableHead className="text-fitness-text text-right">Late</TableHead>
            <TableHead className="text-fitness-text text-right">Overtime</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((employee) => (
            <TableRow 
              key={employee.employee_name}
              className="border-fitness-grid hover:bg-fitness-inner"
            >
              <TableCell className="text-fitness-text font-medium">
                {employee.employee_name}
              </TableCell>
              <TableCell className="text-fitness-text">
                {employee.position_name}
              </TableCell>
              <TableCell className="text-fitness-text text-right">
                {employee.total_scheduled_shifts}
              </TableCell>
              <TableCell className="text-fitness-text text-right">
                {employee.completed_shifts}
              </TableCell>
              <TableCell className="text-fitness-text text-right text-fitness-danger">
                {employee.missed_shifts}
              </TableCell>
              <TableCell className="text-fitness-text text-right text-yellow-500">
                {employee.late_arrivals}
              </TableCell>
              <TableCell className="text-fitness-text text-right text-fitness-accent">
                {employee.total_overtime_hours.toFixed(1)}h
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};