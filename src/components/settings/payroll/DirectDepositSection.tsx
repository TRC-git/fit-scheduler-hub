import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { BankingForm } from "./direct-deposit/BankingForm";
import { FormUpload } from "./direct-deposit/FormUpload";
import { useDirectDeposit } from "./direct-deposit/useDirectDeposit";

export const DirectDepositSection = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { directDepositInfo, saveMutation } = useDirectDeposit();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    saveMutation.mutate({ formData, file: selectedFile });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <h2 className="text-fitness-text text-xl font-semibold mb-4">Direct Deposit Settings</h2>
      <div className="space-y-4 mt-2">
        <div className="flex items-center justify-between">
          <Label className="text-fitness-text">Enable Direct Deposit</Label>
          <Switch 
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </div>

        {isEnabled && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <BankingForm defaultValues={directDepositInfo} />
            <FormUpload 
              onFileChange={handleFileChange}
              isVerified={directDepositInfo?.is_verified}
            />

            <Button 
              type="submit"
              className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                "Saving..."
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Save Direct Deposit Information
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};