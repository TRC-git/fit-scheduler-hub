import { StaffList } from "./sidebar/StaffList";
import { TimeOffRequests } from "./sidebar/TimeOffRequests";
import { ApprovedTimeOff } from "./sidebar/ApprovedTimeOff";

const Sidebar = () => {
  return (
    <aside className="w-[300px] bg-card p-4 space-y-6 border-r border-border">
      <StaffList />
      <ApprovedTimeOff />
      <TimeOffRequests />
    </aside>
  );
};

export default Sidebar;