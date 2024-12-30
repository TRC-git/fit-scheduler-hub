import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TimeOffSection = () => {
  const pendingTimeOff = [
    { name: "Heath Graham", dates: "Dec 24-26", reason: "Holiday" },
    { name: "Jay Duquette", dates: "Dec 31-Jan 2", reason: "New Year" },
  ];

  const approvedTimeOff = [
    { name: "Sarah Connor", dates: "Dec 20-22", approvedBy: "John Smith" },
    { name: "Mike Johnson", dates: "Dec 27-29", approvedBy: "John Smith" },
  ];

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
            {pendingTimeOff.map((request, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-[#202020]"
              >
                <div className="space-y-1">
                  <p className="text-fitness-text font-medium">{request.name}</p>
                  <p className="text-sm text-gray-400">{request.dates}</p>
                  <p className="text-sm text-fitness-accent">{request.reason}</p>
                </div>
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