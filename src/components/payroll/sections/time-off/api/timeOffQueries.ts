import { supabase } from "@/integrations/supabase/client";
import { DateRange } from "@/types/reports";
import { TimeOffRequestResponse } from "../types";

export const fetchTimeOffRequests = async (dateRange: DateRange) => {
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
      approver:employees!time_off_requests_approved_by_fkey (
        firstname,
        lastname
      )
    `)
    .gte('start_date', dateRange.startDate.toISOString())
    .lte('end_date', dateRange.endDate.toISOString())
    .returns<TimeOffRequestResponse[]>();

  if (error) throw error;
  return data || [];
};

export const approveTimeOffRequest = async (requestId: number, adminId: number) => {
  const { error } = await supabase
    .from('time_off_requests')
    .update({
      status: 'approved',
      approved_by: adminId,
      approved_at: new Date().toISOString(),
    })
    .eq('request_id', requestId);

  if (error) throw error;
  return true;
};

export const getCurrentAdminId = async () => {
  const { data: adminData, error: adminError } = await supabase
    .from('employees')
    .select('employeeid')
    .eq('email', (await supabase.auth.getUser()).data.user?.email)
    .single();

  if (adminError) throw adminError;
  return adminData.employeeid;
};