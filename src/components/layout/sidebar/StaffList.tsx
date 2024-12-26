import { Plus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStaffQuery } from "../../staff/hooks/useStaffQuery";
import { getPositionName } from "./utils/positionUtils";

export const StaffList = () => {
  const { data: staff } = useStaffQuery();

  return (
    <div>
      <h2 className="text-xl font-semibold text-fitness-text mb-4">Staff</h2>
      <ScrollArea 
        className="h-[300px] pr-4" 
        style={{
          '--scrollbar-thumb': '#15e7fb',
          '--scrollbar-track': 'transparent'
        } as React.CSSProperties}
      >
        <div className="space-y-3">
          {staff?.map((member) => (
            <div
              key={member.employeeid}
              className="flex items-center justify-between p-3 bg-fitness-inner rounded-md"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <div className="w-full h-full bg-fitness-accent flex items-center justify-center text-white font-semibold">
                    {member.firstname[0]}{member.lastname[0]}
                  </div>
                </Avatar>
                <div>
                  <p className="text-fitness-text font-medium">
                    {member.firstname} {member.lastname}
                  </p>
                  <p className="text-sm text-gray-400">
                    {getPositionName(member)}
                  </p>
                </div>
              </div>
              <Plus className="w-5 h-5 text-fitness-accent cursor-pointer" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};