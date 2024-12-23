import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PermissionCheckbox } from "./PermissionCheckbox";
import { Position, PermissionSettings } from "@/types/permissions";

interface PermissionFormProps {
  positions: Position[];
  selectedPosition: string;
  permissions: PermissionSettings;
  onPositionChange: (value: string) => void;
  onPermissionChange: (key: keyof PermissionSettings, value: boolean) => void;
}

export const PermissionForm = ({
  positions,
  selectedPosition,
  permissions,
  onPositionChange,
  onPermissionChange,
}: PermissionFormProps) => {
  return (
    <div className="grid gap-4">
      <div>
        <Label className="text-fitness-text">Select Position</Label>
        <Select value={selectedPosition} onValueChange={onPositionChange}>
          <SelectTrigger className="bg-fitness-inner text-fitness-text">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            {positions?.map((position) => (
              <SelectItem key={position.positionid} value={position.positionid.toString()}>
                {position.positionname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-fitness-text mb-2">Calendar Access</Label>
        <div className="space-y-2">
          <PermissionCheckbox
            id="view-schedule"
            label="View Schedule"
            checked={permissions.calendar_view}
            onCheckedChange={(checked) => onPermissionChange("calendar_view", checked)}
          />
          <PermissionCheckbox
            id="edit-schedule"
            label="Edit Schedule"
            checked={permissions.calendar_edit}
            onCheckedChange={(checked) => onPermissionChange("calendar_edit", checked)}
          />
          <PermissionCheckbox
            id="manage-schedule"
            label="Manage Schedule Templates"
            checked={permissions.calendar_manage}
            onCheckedChange={(checked) => onPermissionChange("calendar_manage", checked)}
          />
        </div>
      </div>

      <div>
        <Label className="text-fitness-text mb-2">System Access</Label>
        <div className="space-y-2">
          <PermissionCheckbox
            id="manage-employees"
            label="Manage Employees"
            checked={permissions.manage_employees}
            onCheckedChange={(checked) => onPermissionChange("manage_employees", checked)}
          />
          <PermissionCheckbox
            id="manage-positions"
            label="Manage Positions"
            checked={permissions.manage_positions}
            onCheckedChange={(checked) => onPermissionChange("manage_positions", checked)}
          />
          <PermissionCheckbox
            id="manage-payroll"
            label="Manage Payroll"
            checked={permissions.manage_payroll}
            onCheckedChange={(checked) => onPermissionChange("manage_payroll", checked)}
          />
        </div>
      </div>
    </div>
  );
};