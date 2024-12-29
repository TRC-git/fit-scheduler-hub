import { useState } from "react";
import { useStaffQuery } from "@/components/staff/hooks/useStaffQuery";
import { Plus } from "lucide-react";
import { BulkScheduleDialog } from "@/components/schedule/BulkScheduleDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export const StaffList = () => {
  const { data: staff, isLoading } = useStaffQuery();
  const [selectedEmployee, setSelectedEmployee] = useState<{id: number; name: string} | null>(null);

  if (isLoading) {
    return <div className="text-fitness-text">Loading staff...</div>;
  }

  return (
    <div className="space-y-2">
      <ScrollArea className="h-[280px] pr-4" style={{ '--scrollbar-thumb': '#15e7fb' } as React.CSSProperties}>
        {staff?.map((employee) => (
          <div
            key={employee.employeeid}
            className="flex items-center justify-between p-2 rounded-md hover:bg-fitness-card/50 mb-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-fitness-accent/20 flex items-center justify-center">
                <span className="text-[#15e7fb] font-medium">
                  {employee.firstname[0]}{employee.lastname[0]}
                </span>
              </div>
              <span className="text-fitness-text">
                {employee.firstname} {employee.lastname}
              </span>
            </div>
            <Plus
              className="w-5 h-5 text-fitness-accent cursor-pointer"
              onClick={() => setSelectedEmployee({
                id: employee.employeeid,
                name: `${employee.firstname} ${employee.lastname}`
              })}
            />
          </div>
        ))}
      </ScrollArea>

      {selectedEmployee && (
        <BulkScheduleDialog
          employeeId={selectedEmployee.id}
          employeeName={selectedEmployee.name}
          onClose={() => setSelectedEmployee(null)}
          open={!!selectedEmployee}
        />
      )}
    </div>
  );
};