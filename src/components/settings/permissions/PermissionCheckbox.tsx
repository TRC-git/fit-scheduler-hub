import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PermissionCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const PermissionCheckbox = ({
  id,
  label,
  checked,
  onCheckedChange,
}: PermissionCheckboxProps) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
        className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
      />
      <Label htmlFor={id} className="text-fitness-text">
        {label}
      </Label>
    </div>
  );
};