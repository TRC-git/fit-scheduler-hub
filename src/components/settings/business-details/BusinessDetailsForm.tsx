import { Building2, Phone, Receipt, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BusinessLocation } from "./types";

interface BusinessDetailsFormProps {
  businessLocation: BusinessLocation | null;
}

export const BusinessDetailsForm = ({ businessLocation }: BusinessDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Building2 className="w-5 h-5 text-fitness-accent" />
        <div className="flex-1">
          <Label htmlFor="business_name" className="text-fitness-text">Business Name</Label>
          <Input
            id="business_name"
            name="business_name"
            defaultValue={businessLocation?.business_name || ''}
            className="bg-fitness-inner text-fitness-text border-fitness-muted"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Phone className="w-5 h-5 text-fitness-accent" />
        <div className="flex-1">
          <Label htmlFor="phone_number" className="text-fitness-text">Phone Number</Label>
          <Input
            id="phone_number"
            name="phone_number"
            defaultValue={businessLocation?.phone_number || ''}
            className="bg-fitness-inner text-fitness-text border-fitness-muted"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Receipt className="w-5 h-5 text-fitness-accent" />
        <div className="flex-1">
          <Label htmlFor="tax_id" className="text-fitness-text">Tax ID</Label>
          <Input
            id="tax_id"
            name="tax_id"
            defaultValue={businessLocation?.tax_id || ''}
            className="bg-fitness-inner text-fitness-text border-fitness-muted"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <MapPin className="w-5 h-5 text-fitness-accent" />
        <div className="flex-1">
          <Label htmlFor="address" className="text-fitness-text">Address</Label>
          <Input
            id="address"
            name="address"
            defaultValue={businessLocation?.address || ''}
            className="bg-fitness-inner text-fitness-text border-fitness-muted"
          />
          {businessLocation?.latitude && businessLocation?.longitude && (
            <div className="mt-2 text-sm text-fitness-text/70 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-fitness-accent" />
              <span>Coordinates: {businessLocation.latitude.toFixed(6)}, {businessLocation.longitude.toFixed(6)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};