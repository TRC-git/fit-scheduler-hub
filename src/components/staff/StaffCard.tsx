import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Ban, Unlock, Trash2 } from "lucide-react";
import { Position } from "../settings/positions/types";

interface StaffCardProps {
  member: any;
  onEdit: (member: any) => void;
  onSuspend: (employeeId: number, suspend: boolean) => void;
  onDelete: (member: any) => void;
}

export const StaffCard = ({ member, onEdit, onSuspend, onDelete }: StaffCardProps) => {
  return (
    <Card key={member.employeeid} className="p-4 bg-fitness-card">
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
            {member.suspended && (
              <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">
                Suspended
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">{member.email}</p>
          <p className="text-sm text-gray-400">{member.phonenumber}</p>
          <div className="mt-2 space-y-1">
            {member.employeepositions?.map((position: any, index: number) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-fitness-accent">
                  {position.positions.positionname}
                  {position.is_primary && " (Primary)"}
                </span>
                <span className="text-fitness-text">
                  ${position.payrate}/hr
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#15e7fb]"
            onClick={() => onEdit(member)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={member.suspended ? "text-green-500" : "text-yellow-500"}
            onClick={() => onSuspend(member.employeeid, !member.suspended)}
          >
            {member.suspended ? (
              <Unlock className="h-4 w-4" />
            ) : (
              <Ban className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-fitness-danger"
            onClick={() => onDelete(member)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};