export interface Employee {
  firstname: string;
  lastname: string;
}

export interface TimeOffRequest {
  request_id: number;
  employee_id: number;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: string;
  approved_by: number | null;
  approved_at: string | null;
  employees: Employee;
  approver?: Employee;
}

export interface TimeOffRequestResponse {
  request_id: number;
  employee_id: number;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: string;
  approved_by: number | null;
  approved_at: string | null;
  employees: Employee;
  approver: Employee | null;
}