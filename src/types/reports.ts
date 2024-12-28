export interface EmployeeHours {
  total_scheduled_hours: number;
  total_worked_hours: number;
  total_overtime_hours: number;
  late_clock_ins: number;
  missed_clock_ins: number;
}

export interface PositionScheduleSummary {
  position_name: string;
  total_shifts: number;
  total_scheduled_hours: number;
  total_employees: number;
  avg_shift_duration: number;
}

export interface EmployeeAttendanceSummary {
  employee_name: string;
  position_name: string;
  total_scheduled_shifts: number;
  completed_shifts: number;
  missed_shifts: number;
  late_arrivals: number;
  total_overtime_hours: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}