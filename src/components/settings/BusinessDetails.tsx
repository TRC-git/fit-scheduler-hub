import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessDetailsForm } from "./business-details/BusinessDetailsForm";
import { LogoUpload } from "./business-details/LogoUpload";
import { useBusinessLocation } from "./business-details/useBusinessLocation";
import { BusinessLocationUpdate } from "./business-details/types";

const BusinessDetails = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { businessLocation, isLoading, updateMutation } = useBusinessLocation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates: BusinessLocationUpdate = {
      business_name: formData.get('business_name') as string,
      phone_number: formData.get('phone_number') as string,
      tax_id: formData.get('tax_id') as string,
      address: formData.get('address') as string,
    };

    if (logoFile) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('business-logos')
        .upload(`logo-${Date.now()}`, logoFile);

      if (uploadError) {
        toast({
          title: "Error",
          description: "Failed to upload logo",
          variant: "destructive",
        });
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('business-logos')
        .getPublicUrl(uploadData.path);

      updates.logo_url = publicUrl;
    }

    updateMutation.mutate(updates);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Business Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BusinessDetailsForm businessLocation={businessLocation} />
          <LogoUpload 
            businessLocation={businessLocation}
            onFileSelect={setLogoFile}
          />
          <Button 
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full bg-fitness-accent hover:bg-fitness-accent/90 text-black"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessDetails;