import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PositionScheduleSummary } from "@/types/reports";

interface PositionSummaryTableProps {
  data: PositionScheduleSummary[] | undefined;
  isLoading: boolean;
}

export const PositionSummaryTable = ({ data, isLoading }: PositionSummaryTableProps) => {
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
            <TableHead className="text-fitness-text">Position</TableHead>
            <TableHead className="text-fitness-text text-right">Total Shifts</TableHead>
            <TableHead className="text-fitness-text text-right">Total Hours</TableHead>
            <TableHead className="text-fitness-text text-right">Total Staff</TableHead>
            <TableHead className="text-fitness-text text-right">Avg Shift Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((position) => (
            <TableRow 
              key={position.position_name} 
              className="border-fitness-grid hover:bg-fitness-inner"
            >
              <TableCell className="text-fitness-text font-medium">
                {position.position_name}
              </TableCell>
              <TableCell className="text-fitness-text text-right">
                {position.total_shifts}
              </TableCell>
              <TableCell className="text-fitness-text text-right">
                {position.total_scheduled_hours.toFixed(1)}h
              </TableCell>
              <TableCell className="text-fitness-text text-right">
                {position.total_employees}
              </TableCell>
              <TableCell className="text-fitness-text text-right">
                {position.avg_shift_duration.toFixed(1)}h
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};