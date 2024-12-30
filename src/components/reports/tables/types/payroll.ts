import { Json } from "@/types/database/common";

export interface PayrollRecord {
  record_id: number;
  pay_period_start: string;
  pay_period_end: string;
  total_hours: number;
  total_overtime_hours: number;
  gross_pay: number;
  net_pay: number;
  status: 'draft' | 'finalized';
  created_by?: number;
  created_at?: string;
  last_edited_by?: number;
  last_edited_at?: string;
  notes?: string;
  adjustments: Adjustments;
}

export interface Adjustments {
  bonus: number;
  deductions: number;
  comments: string;
}

export interface PayrollSummaryTableProps {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  selectedEmployee?: number;
}