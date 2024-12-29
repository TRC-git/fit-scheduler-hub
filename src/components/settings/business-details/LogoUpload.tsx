import { useState } from "react";
import { Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BusinessLocation } from "./types";

interface LogoUploadProps {
  businessLocation: BusinessLocation | null;
  onFileSelect: (file: File | null) => void;
}

export const LogoUpload = ({ businessLocation, onFileSelect }: LogoUploadProps) => {
  return (
    <div className="flex items-center space-x-4">
      <Image className="w-5 h-5 text-fitness-accent" />
      <div className="flex-1">
        <Label htmlFor="logo" className="text-fitness-text">Business Logo</Label>
        <Input
          id="logo"
          type="file"
          accept="image/*"
          onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
          className="bg-fitness-inner text-fitness-text border-fitness-muted"
        />
        {businessLocation?.logo_url && (
          <div className="mt-4">
            <img
              src={businessLocation.logo_url}
              alt="Business Logo"
              className="w-32 h-32 object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};