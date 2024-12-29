import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface StaffBasicInfoProps {
  formData: {
    firstname: string;
    lastname: string;
    email: string;
    phonenumber: string;
    is_admin: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
}

export const StaffBasicInfo = ({ formData, onChange }: StaffBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-fitness-text">First Name</Label>
          <Input
            value={formData.firstname}
            onChange={(e) => onChange('firstname', e.target.value)}
            className="bg-fitness-inner text-fitness-text"
          />
        </div>
        <div>
          <Label className="text-fitness-text">Last Name</Label>
          <Input
            value={formData.lastname}
            onChange={(e) => onChange('lastname', e.target.value)}
            className="bg-fitness-inner text-fitness-text"
          />
        </div>
      </div>
      <div>
        <Label className="text-fitness-text">Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="bg-fitness-inner text-fitness-text"
        />
      </div>
      <div>
        <Label className="text-fitness-text">Phone Number</Label>
        <Input
          type="tel"
          value={formData.phonenumber}
          onChange={(e) => onChange('phonenumber', e.target.value)}
          className="bg-fitness-inner text-fitness-text"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_admin"
          checked={formData.is_admin}
          onCheckedChange={(checked) => onChange('is_admin', checked as boolean)}
          className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
        />
        <Label htmlFor="is_admin" className="text-fitness-text">
          Administrator Access
        </Label>
      </div>
    </div>
  );
};