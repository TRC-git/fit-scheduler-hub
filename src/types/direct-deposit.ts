export interface DirectDepositInfo {
  id: number;
  employee_id: number;
  bank_name: string;
  account_type: string;
  routing_number: string;
  account_number: string;
  form_file_path?: string;
  is_verified: boolean;
  created_at: string;
}