import Header from "@/components/layout/Header";
import { PayrollDashboard } from "@/components/payroll/PayrollDashboard";

const Payroll = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <div className="flex-1 p-8 overflow-auto">
        <PayrollDashboard />
      </div>
    </div>
  );
};

export default Payroll;