import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "./DateRangePicker";
import { useReports } from "@/hooks/reports/useReports";
import { DateRange } from "@/types/reports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, User, DollarSign } from "lucide-react";
import { PositionSummaryTable } from "./tables/PositionSummaryTable";
import { AttendanceSummaryTable } from "./tables/AttendanceSummaryTable";
import { StaffSummaryTable } from "./tables/StaffSummaryTable";
import { PayrollSummaryTable } from "./tables/PayrollSummaryTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStaffQuery } from "@/components/staff/hooks/useStaffQuery";

export const StaffReports = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const { data: staff } = useStaffQuery();

  const {
    positionSummary,
    attendanceSummary,
    employeeHours,
    isLoadingPositionSummary,
    isLoadingAttendanceSummary,
    isLoadingEmployeeHours,
  } = useReports(
    dateRange.startDate, 
    dateRange.endDate, 
    selectedEmployee !== "all" ? parseInt(selectedEmployee) : undefined
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Staff Reports</h2>
        <div className="flex items-center gap-4">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-[200px] bg-card border-border text-foreground">
              <SelectValue placeholder="Select staff member" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all" className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                All Staff
              </SelectItem>
              {staff?.map((member) => (
                <SelectItem 
                  key={member.employeeid} 
                  value={member.employeeid.toString()}
                  className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {member.firstname} {member.lastname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>
      </div>

      <Tabs defaultValue="position" className="space-y-4">
        <TabsList className="bg-card border-border">
          <TabsTrigger value="position" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="w-4 h-4 mr-0.5" />
            Position Summary
          </TabsTrigger>
          <TabsTrigger value="attendance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="w-4 h-4 mr-0.5" />
            Attendance Summary
          </TabsTrigger>
          <TabsTrigger value="staff" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="w-4 h-4 mr-0.5" />
            Staff Summary
          </TabsTrigger>
          <TabsTrigger value="payroll" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <DollarSign className="w-4 h-4 mr-0.5" />
            Payroll Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="position" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Position Schedule Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PositionSummaryTable 
                data={positionSummary} 
                isLoading={isLoadingPositionSummary} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Staff Attendance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceSummaryTable 
                data={attendanceSummary} 
                isLoading={isLoadingAttendanceSummary} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Individual Staff Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StaffSummaryTable 
                data={employeeHours} 
                isLoading={isLoadingEmployeeHours} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Payroll Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PayrollSummaryTable 
                dateRange={dateRange}
                selectedEmployee={selectedEmployee !== "all" ? parseInt(selectedEmployee) : undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};