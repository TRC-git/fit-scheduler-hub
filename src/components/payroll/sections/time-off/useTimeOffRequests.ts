import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TimeOffRequest } from "./types";
import { DateRange } from "@/types/reports";

export const useTimeOffRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);

  const fetchRequests = async (dateRange: DateRange) => {
    try {
      const { data, error } = await supabase
        .from('time_off_requests')
        .select(`
          request_id,
          employee_id,
          start_date,
          end_date,
          reason,
          status,
          approved_by,
          approved_at,
          employees!time_off_requests_employee_id_fkey (
            firstname,
            lastname
          ),
          approver:time_off_requests_approved_by_fkey!employees (
            firstname,
            lastname
          )
        `)
        .gte('start_date', dateRange.startDate.toISOString())
        .lte('end_date', dateRange.endDate.toISOString());

      if (error) throw error;
      
      if (!data) {
        setRequests([]);
        return;
      }

      const transformedData = data.map(request => ({
        ...request,
        employees: {
          firstname: request.employees?.firstname || '',
          lastname: request.employees?.lastname || ''
        },
        approver: request.approver ? {
          firstname: request.approver.firstname || '',
          lastname: request.approver.lastname || ''
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