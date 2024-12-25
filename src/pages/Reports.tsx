import { Card } from "@/components/ui/card";

const Reports = () => {
  return (
    <div className="flex flex-col min-h-screen bg-fitness-background">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-fitness-text mb-6">Reports</h1>
        <div className="grid gap-6">
          <Card className="p-6 bg-fitness-card">
            <h2 className="text-xl font-semibold text-fitness-text mb-4">Reports Dashboard</h2>
            <p className="text-fitness-text/70">
              View and generate reports for your business.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;