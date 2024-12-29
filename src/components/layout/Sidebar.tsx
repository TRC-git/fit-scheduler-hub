import { StaffList } from "./sidebar/StaffList";
import { ScheduleProvider } from "@/contexts/schedule/ScheduleContext";

const Sidebar = () => {
  return (
    <aside className="w-[300px] bg-fitness-card p-4">
      <ScheduleProvider>
        <StaffList />
      </ScheduleProvider>
    </aside>
  );
};

export default Sidebar;