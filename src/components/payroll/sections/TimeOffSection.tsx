import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const TimeOffSection = () => {
  const { toast } = useToast();
  const [pendingTimeOff, setPendingTimeOff] = useState([
    { id: 1, name: "Heath Graham", dates: "Dec 24-26", reason: "Holiday" },
    { id: 2, name: "Jay Duquette", dates: "Dec 31-Jan 2", reason: "New Year" },
  ]);

  const [approvedTimeOff, setApprovedTimeOff] = useState([
    { name: "Sarah Connor", dates: "Dec 20-22", approvedBy: "John Smith" },
    { name: "Mike Johnson", dates: "Dec 27-29", approvedBy: "John Smith" },
  ]);

  const handleApprove = async (requestId: number) => {
    try {
      // Get current admin's info
      const { data: adminData, error: adminError } = await supabase
        .from('employees')
        .select('firstname, lastname')
        .eq('email', (await supabase.auth.getUser()).data.user?.email)
        .single();

      if (adminError) throw adminError;

      const adminName = `${adminData.firstname} ${adminData.lastname}`;

      // Find the request to approve
      const requestToApprove = pendingTimeOff.find(req => req.id === requestId);
      if (!requestToApprove) return;

      // Move to approved list
      setApprovedTimeOff(prev => [...prev, {
        name: requestToApprove.name,
        dates: requestToApprove.dates,
        approvedBy: adminName
      }]);

      // Remove from pending
      setPendingTimeOff(prev => prev.filter(req => req.id !== requestId));

      toast({
        title: "Success",
        description: "Time off request approved successfully",
      });
    } catch (error) {
      console.error('Error approving time off:', error);
      toast({
        title: "Error",
        description: "Failed to approve time off request",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text flex items-center gap-2">
          <Calendar className="w-5 h-5 text-fitness-accent" />
          Time Off Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="bg-[#202020]">
            <TabsTrigger value="pending" className="data-[state=active]:bg-fitness-accent data-[state=active]:text-black">
              Pending Requests
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-fitness-accent data-[state=active]:text-black">
              Approved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingTimeOff.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 rounded-lg bg-[#202020]"
              >
                <div className="space-y-1">
                  <p className="text-fitness-text font-medium">{request.name}</p>
                  <p className="text-sm text-gray-400">{request.dates}</p>
                  <p className="text-sm text-fitness-accent">{request.reason}</p>
                </div>
                <Button 
                  onClick={() => handleApprove(request.id)}
                  className="bg-fitness-accent text-black hover:bg-fitness-accent/90"
                >
                  Approve
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {approvedTimeOff.map((timeOff, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-[#202020]"
              >
                <div className="space-y-1">
                  <p className="text-fitness-text font-medium">{timeOff.name}</p>
                  <p className="text-sm text-gray-400">{timeOff.dates}</p>
                  <p className="text-sm text-fitness-accent">
                    Approved by: {timeOff.approvedBy}
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