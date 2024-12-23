import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

interface FormUploadProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isVerified?: boolean;
}

export const FormUpload = ({ onFileChange, isVerified }: FormUploadProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-fitness-text">Direct Deposit Form</Label>
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={onFileChange}
          className="bg-fitness-inner text-fitness-text"
        />
        {isVerified && (
          <div className="flex items-center text-green-500">
            <CheckCircle2 className="w-5 h-5 mr-1" />
            <span>Verified</span>
          </div>
        )}
      </div>
    </div>
  );
};