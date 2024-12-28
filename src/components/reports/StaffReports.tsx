import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "./DateRangePicker";
import { useReports } from "@/hooks/reports/useReports";
import { DateRange } from "@/types/reports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users } from "lucide-react";
import { PositionSummaryTable } from "./tables/PositionSummaryTable";
import { AttendanceSummaryTable } from "./tables/AttendanceSummaryTable";

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
              <PositionSummaryTable 
                data={positionSummary} 
                isLoading={isLoadingPositionSummary} 
              />
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
              <AttendanceSummaryTable 
                data={attendanceSummary} 
                isLoading={isLoadingAttendanceSummary} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};