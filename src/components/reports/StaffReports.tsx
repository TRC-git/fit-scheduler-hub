import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "./DateRangePicker";
import { useReports } from "@/hooks/reports/useReports";
import { DateRange } from "@/types/reports";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export const StaffReports = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const {
    positionSummary,
    attendanceSummary,
    isLoadingPositionSummary,
    isLoadingAttendanceSummary,
  } = useReports(dateRange.startDate, dateRange.endDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-fitness-text">Staff Reports</h2>
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      <Tabs defaultValue="position" className="space-y-4">
        <TabsList>
          <TabsTrigger value="position">Position Summary</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="position" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Position Schedule Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPositionSummary ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Total Shifts</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Total Staff</TableHead>
                      <TableHead>Avg Shift Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positionSummary?.map((position) => (
                      <TableRow key={position.position_name}>
                        <TableCell>{position.position_name}</TableCell>
                        <TableCell>{position.total_shifts}</TableCell>
                        <TableCell>
                          {position.total_scheduled_hours.toFixed(1)}h
                        </TableCell>
                        <TableCell>{position.total_employees}</TableCell>
                        <TableCell>
                          {position.avg_shift_duration.toFixed(1)}h
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAttendanceSummary ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Scheduled Shifts</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Missed</TableHead>
                      <TableHead>Late Arrivals</TableHead>
                      <TableHead>Overtime Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceSummary?.map((employee) => (
                      <TableRow key={employee.employee_name}>
                        <TableCell>{employee.employee_name}</TableCell>
                        <TableCell>{employee.position_name}</TableCell>
                        <TableCell>{employee.total_scheduled_shifts}</TableCell>
                        <TableCell>{employee.completed_shifts}</TableCell>
                        <TableCell>{employee.missed_shifts}</TableCell>
                        <TableCell>{employee.late_arrivals}</TableCell>
                        <TableCell>
                          {employee.total_overtime_hours.toFixed(1)}h
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};