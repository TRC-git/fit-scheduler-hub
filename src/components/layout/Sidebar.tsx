import { StaffList } from "./sidebar/StaffList";
import { ApprovedTimeOff } from "./sidebar/ApprovedTimeOff";
import { TimeOffRequests } from "./sidebar/TimeOffRequests";

const Sidebar = () => {
  return (
    <aside className="w-72 bg-fitness-card border-r border-fitness-muted p-4 flex flex-col gap-6">
      <StaffList />
      <ApprovedTimeOff />
      <TimeOffRequests />
    </aside>
  );
};

export default Sidebar;