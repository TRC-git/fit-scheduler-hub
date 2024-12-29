import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  is_admin?: boolean;
}

interface StaffFormFieldsProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string | boolean) => void;
}

export const StaffFormFields = ({ formData, onChange }: StaffFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstname" className="text-fitness-text">First Name</Label>
          <Input
            id="firstname"
            value={formData.firstname}
            onChange={(e) => onChange('firstname', e.target.value)}
            className="bg-fitness-inner text-fitness-text"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastname" className="text-fitness-text">Last Name</Label>
          <Input
            id="lastname"
            value={formData.lastname}
            onChange={(e) => onChange('lastname', e.target.value)}
            className="bg-fitness-inner text-fitness-text"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-fitness-text">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="bg-fitness-inner text-fitness-text"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-fitness-text">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phonenumber}
          onChange={(e) => onChange('phonenumber', e.target.value)}
          className="bg-fitness-inner text-fitness-text"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="admin"
          checked={formData.is_admin}
          onCheckedChange={(checked) => onChange('is_admin', checked)}
          className="data-[state=checked]:bg-[#15e7fb]"
        />
        <Label htmlFor="admin" className="text-fitness-text">Admin Privileges</Label>
      </div>
    </>
  );
};