import Header from "@/components/layout/Header";
import { StaffReports } from "@/components/reports/StaffReports";

const Reports = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto py-6 bg-background min-h-screen">
        <StaffReports />
      </div>
    </>
  );
};

export default Reports;