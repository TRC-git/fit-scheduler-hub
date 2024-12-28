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
import { BarChart3, Users } from "lucide-react";

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
        <TabsList className="bg-fitness-card border-fitness-grid">
          <TabsTrigger value="position" className="data-[state=active]:bg-fitness-accent data-[state=active]:text-black">
            <BarChart3 className="w-4 h-4 mr-2" />
            Position Summary
          </TabsTrigger>
          <TabsTrigger value="attendance" className="data-[state=active]:bg-fitness-accent data-[state=active]:text-black">
            <Users className="w-4 h-4 mr-2" />
            Attendance Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="position" className="space-y-4">
          <Card className="bg-fitness-card border-fitness-grid">
            <CardHeader>
              <CardTitle className="text-fitness-text flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-fitness-accent" />
                Position Schedule Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPositionSummary ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full bg-fitness-grid" />
                  ))}
                </div>
              ) : (
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
                      {positionSummary?.map((position) => (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card className="bg-fitness-card border-fitness-grid">
            <CardHeader>
              <CardTitle className="text-fitness-text flex items-center gap-2">
                <Users className="w-5 h-5 text-fitness-accent" />
                Staff Attendance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAttendanceSummary ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full bg-fitness-grid" />
                  ))}
                </div>
              ) : (
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
                      {attendanceSummary?.map((employee) => (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};