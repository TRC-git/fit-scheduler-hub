import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { PayRateDialog } from "./dialog/PayRateDialog";
import { StatusBadges } from "./components/StatusBadges";
import { StaffPositions } from "./components/StaffPositions";
import { StaffActions } from "./components/StaffActions";

interface StaffCardProps {
  member: any;
  onEdit: (member: any) => void;
  onSuspend: (employeeId: number, suspend: boolean) => void;
  onDelete: (member: any) => void;
  onUpdatePayRate: (employeeId: number, positionId: number, payRate: number) => void;
}

export const StaffCard = ({ 
  member, 
  onEdit, 
  onSuspend, 
  onDelete,
  onUpdatePayRate 
}: StaffCardProps) => {
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [isPayRateDialogOpen, setIsPayRateDialogOpen] = useState(false);

  const handlePayRateEdit = (position: any) => {
    setSelectedPosition(position);
    setIsPayRateDialogOpen(true);
  };

  const handlePayRateSubmit = (payRate: number) => {
    if (selectedPosition) {
      onUpdatePayRate(member.employeeid, selectedPosition.positions.positionid, payRate);
      setIsPayRateDialogOpen(false);
      setSelectedPosition(null);
    }
  };

  return (
    <>
      <Card className="p-4 bg-fitness-card">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <div className="w-full h-full bg-fitness-accent flex items-center justify-center text-white font-semibold">
              {member.firstname[0]}{member.lastname[0]}
            </div>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-fitness-text font-medium">
                {member.firstname} {member.lastname}
              </h3>
              <StatusBadges 
                isSuspended={member.suspended} 
                isAdmin={member.is_admin} 
              />
            </div>
            <p className="text-sm text-gray-400">{member.email}</p>
            <p className="text-sm text-gray-400">{member.phonenumber}</p>
            {member.positions && (
              <div className="mt-1">
                <span className="text-xs text-fitness-accent">
                  Primary Position: {member.positions.positionname}
                </span>
              </div>
            )}
            <StaffPositions 
              positions={member.employeepositions} 
              onPayRateEdit={handlePayRateEdit}
            />
          </div>
          <StaffActions
            isSuspended={member.suspended}
            onEdit={() => onEdit(member)}
            onSuspend={() => onSuspend(member.employeeid, !member.suspended)}
            onDelete={() => onDelete(member)}
          />
        </div>
      </Card>

      <PayRateDialog
        isOpen={isPayRateDialogOpen}
        onClose={() => setIsPayRateDialogOpen(false)}
        position={selectedPosition}
        onSubmit={handlePayRateSubmit}
      />
    </>
  );
};