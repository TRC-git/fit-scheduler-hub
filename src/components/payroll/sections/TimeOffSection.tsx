import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { DateRangePicker } from "@/components/reports/DateRangePicker";
import { startOfWeek, endOfWeek } from "date-fns";
import { DateRange } from "@/types/reports";

interface TimeOffRequest {
  request_id: number;
  employee_id: number;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: string;
  approved_by: number | null;
  approved_at: string | null;
  employees: {
    firstname: string;
    lastname: string;
  };
  approver?: {
    firstname: string;
    lastname: string;
  };
}

export const TimeOffSection = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday
    endDate: endOfWeek(new Date(), { weekStartsOn: 1 }), // Sunday
  });

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('time_off_requests')
        .select(`
          *,
          employees:employee_id(firstname, lastname),
          approver:approved_by(firstname, lastname)
        `)
        .gte('start_date', dateRange.startDate.toISOString())
        .lte('end_date', dateRange.endDate.toISOString());

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = data?.map(request => ({
        ...request,
        employees: request.employees as { firstname: string; lastname: string },
        approver: request.approver as { firstname: string; lastname: string } | undefined
      })) || [];

      setRequests(transformedData);
    } catch (error) {
      console.error('Error fetching time off requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch time off requests",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [dateRange]);

  const handleApprove = async (requestId: number) => {
    try {
      const { data: adminData, error: adminError } = await supabase
        .from('employees')
        .select('employeeid')
        .eq('email', (await supabase.auth.getUser()).data.user?.email)
        .single();

      if (adminError) throw adminError;

      const { error: updateError } = await supabase
        .from('time_off_requests')
        .update({
          status: 'approved',
          approved_by: adminData.employeeid,
          approved_at: new Date().toISOString(),
        })
        .eq('request_id', requestId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Time off request approved successfully",
      });

      fetchRequests();
    } catch (error) {
      console.error('Error approving time off:', error);
      toast({
        title: "Error",
        description: "Failed to approve time off request",
        variant: "destructive",
      });
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

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.request_id}
                className="flex items-center justify-between p-4 rounded-lg bg-[#202020]"
              >
                <div className="space-y-1">
                  <p className="text-fitness-text font-medium">
                    {request.employees.firstname} {request.employees.lastname}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                  </p>
                  {request.reason && (
                    <p className="text-sm text-fitness-accent">{request.reason}</p>
                  )}
                </div>
                <Button 
                  onClick={() => handleApprove(request.request_id)}
                  className="bg-fitness-accent text-black hover:bg-fitness-accent/90"
                >
                  Approve
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {approvedRequests.map((request) => (
              <div
                key={request.request_id}
                className="flex items-center justify-between p-4 rounded-lg bg-[#202020]"
              >
                <div className="space-y-1">
                  <p className="text-fitness-text font-medium">
                    {request.employees.firstname} {request.employees.lastname}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                  </p>
                  {request.reason && (
                    <p className="text-sm text-fitness-accent">{request.reason}</p>
                  )}
                  <p className="text-sm text-gray-400">
                    Approved by: {request.approver?.firstname} {request.approver?.lastname}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};