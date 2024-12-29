import Sidebar from "@/components/layout/Sidebar";
import ScheduleHeader from "@/components/schedule/ScheduleHeader";
import ScheduleGrid from "@/components/schedule/ScheduleGrid";
import { ScheduleProvider } from "@/contexts/schedule/ScheduleContext";

const Index = () => {
  return (
    <div className="flex h-screen bg-fitness-background">
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
  );
};

export default Index;