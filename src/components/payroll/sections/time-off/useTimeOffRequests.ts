import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TimeOffRequest } from "./types";
import { DateRange } from "@/types/reports";
import { approveTimeOffRequest, fetchTimeOffRequests, getCurrentAdminId } from "./api/timeOffQueries";

export const useTimeOffRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);

  const fetchRequests = async (dateRange: DateRange) => {
    try {
      const data = await fetchTimeOffRequests(dateRange);
      
      const transformedData = data.map(request => ({
        ...request,
        employees: {
          firstname: request.employees.firstname,
          lastname: request.employees.lastname
        },
        approver: request.approver ? {
          firstname: request.approver.firstname,
          lastname: request.approver.lastname
        } : undefined
      }));

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

  const handleApprove = async (requestId: number) => {
    try {
      const adminId = await getCurrentAdminId();
      await approveTimeOffRequest(requestId, adminId);

      toast({
        title: "Success",
        description: "Time off request approved successfully",
      });

      return true;
    } catch (error) {
      console.error('Error approving time off:', error);
      toast({
        title: "Error",
        description: "Failed to approve time off request",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    requests,
    fetchRequests,
    handleApprove,
  };
};