import { supabase } from "@/integrations/supabase/client";
import { Adjustments, PayrollRecord } from "../types/payroll";
import { Json } from "@/types/database/common";

export const usePayrollMutations = () => {
  const savePayroll = async (payrollRecord: PayrollRecord, adjustments: Adjustments) => {
    const adjustedGrossPay = payrollRecord.gross_pay + adjustments.bonus - adjustments.deductions;
    const adjustedNetPay = adjustedGrossPay * 0.75;

    const { error } = await supabase
      .from('payroll_records')
      .upsert({
        pay_period_start: payrollRecord.pay_period_start,
        pay_period_end: payrollRecord.pay_period_end,
        total_hours: payrollRecord.total_hours,
        total_overtime_hours: payrollRecord.total_overtime_hours,
        gross_pay: adjustedGrossPay,
        net_pay: adjustedNetPay,
        status: 'draft',
        adjustments: adjustments as unknown as Json
      });

    return { error };
  };

  const finalizePayroll = async (payrollRecord: PayrollRecord) => {
    const { error } = await supabase
      .from('payroll_records')
      .update({ status: 'finalized' })
      .eq('pay_period_start', payrollRecord.pay_period_start)
      .eq('pay_period_end', payrollRecord.pay_period_end);

    return { error };
  };

  return { savePayroll, finalizePayroll };
};