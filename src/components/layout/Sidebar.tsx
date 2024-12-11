import { Plus, Check, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const staffMembers = [
  { id: 1, name: "Heath Graham", role: "Coach", avatar: "HG" },
  { id: 2, name: "Ted Gonder", role: "Coach", avatar: "TG" },
  { id: 3, name: "Jay Duquette", role: "Coach", avatar: "JD" },
  { id: 4, name: "Jane Doe", role: "Personal Trainer", avatar: "JD" },
];

const approvedTimeOff = [
  { name: "Heath Graham", approver: "Manager Name" },
  { name: "Jay Duquette", approver: "Manager Name" },
];

const timeOffRequests = [
  { name: "Heath Graham", status: "pending" },
  { name: "Jay Duquette", status: "pending" },
];

const Sidebar = () => {
  return (
    <aside className="w-72 bg-fitness-card border-r border-fitness-muted p-4 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-fitness-text mb-4">Staff</h2>
        <div className="space-y-3">
          {staffMembers.map((staff) => (
            <div
              key={staff.id}
              className="flex items-center justify-between p-3 bg-[#1A1F2C] rounded-md"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <div className="w-full h-full bg-fitness-accent flex items-center justify-center text-white font-semibold">
                    {staff.avatar}
                  </div>
                </Avatar>
                <div>
                  <p className="text-fitness-text font-medium">{staff.name}</p>
                  <p className="text-sm text-gray-400">{staff.role}</p>
                </div>
              </div>
              <Plus className="w-5 h-5 text-fitness-accent cursor-pointer" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-fitness-text mb-4">
          Approved Time Off
        </h2>
        <div className="space-y-3">
          {approvedTimeOff.map((item, index) => (
            <div
              key={index}
              className="p-3 bg-[#1A1F2C] rounded-md text-fitness-text"
            >
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-400">Approved: {item.approver}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-fitness-text">
            Time Off Request
          </h2>
          <button className="flex items-center gap-1 text-fitness-accent">
            <Plus className="w-4 h-4" />
            Ask
          </button>
        </div>
        <div className="space-y-3">
          {timeOffRequests.map((request, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#1A1F2C] rounded-md"
            >
              <span className="text-fitness-text">{request.name}</span>
              <div className="flex gap-2">
                <Check className="w-5 h-5 text-green-500 cursor-pointer" />
                <X className="w-5 h-5 text-red-500 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;