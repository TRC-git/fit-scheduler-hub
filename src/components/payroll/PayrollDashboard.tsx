import { Card } from "@/components/ui/card";
import { ClockInStaff } from "./sections/ClockInStaff";
import { PayrollSummary } from "./sections/PayrollSummary";
import { TimeOffSection } from "./sections/TimeOffSection";
import { PayrollReports } from "./sections/PayrollReports";

export const PayrollDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-fitness-text">Payroll & Hours</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ClockInStaff />
        <PayrollSummary />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TimeOffSection />
        <PayrollReports />
      </div>
    </div>
  );
};