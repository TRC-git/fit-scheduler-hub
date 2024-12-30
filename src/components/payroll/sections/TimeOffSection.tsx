import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { startOfWeek, endOfWeek } from "date-fns";
import { DateRangePicker } from "@/components/reports/DateRangePicker";
import { DateRange } from "@/types/reports";
import { useTimeOffRequests } from "./time-off/useTimeOffRequests";
import { RequestList } from "./time-off/RequestList";
import { useEffect, useState } from "react";

export const TimeOffSection = () => {
  const { requests, fetchRequests, handleApprove } = useTimeOffRequests();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }), // Sunday
  });

  useEffect(() => {
    fetchRequests(dateRange);
  }, [dateRange]);

  const handleApproveRequest = async (requestId: number) => {
    const success = await handleApprove(requestId);
    if (success) {
      fetchRequests(dateRange);
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const approvedRequests = requests.filter(req => req.status === 'approved');

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text flex items-center gap-2">
          <Calendar className="w-5 h-5 text-fitness-accent" />
          Time Off Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="bg-[#202020]">
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-fitness-accent data-[state=active]:text-black"
            >
              Pending Requests ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger 
              value="approved" 
              className="data-[state=active]:bg-fitness-accent data-[state=active]:text-black"
            >
              Approved ({approvedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <RequestList 
              requests={pendingRequests} 
              onApprove={handleApproveRequest}
              type="pending"
            />
          </TabsContent>

          <TabsContent value="approved">
            <RequestList 
              requests={approvedRequests}
              type="approved"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};