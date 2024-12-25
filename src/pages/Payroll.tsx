import { Card } from "@/components/ui/card";

const Payroll = () => {
  return (
    <div className="flex flex-col min-h-screen bg-fitness-background">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-fitness-text mb-6">Payroll & Hours</h1>
        <div className="grid gap-6">
          <Card className="p-6 bg-fitness-card">
            <h2 className="text-xl font-semibold text-fitness-text mb-4">Payroll Dashboard</h2>
            <p className="text-fitness-text/70">
              Manage employee payroll and working hours.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payroll;