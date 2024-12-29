import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ScheduleHeader from "@/components/schedule/ScheduleHeader";
import ScheduleGrid from "@/components/schedule/ScheduleGrid";
import { ScheduleProvider } from "@/contexts/schedule/ScheduleContext";

const Index = () => {
  return (
    <div className="flex flex-col h-screen bg-fitness-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <ScheduleProvider>
            <ScheduleHeader />
            <div className="mt-8">
              <ScheduleGrid />
            </div>
          </ScheduleProvider>
        </main>
      </div>
    </div>
  );
};

export default Index;