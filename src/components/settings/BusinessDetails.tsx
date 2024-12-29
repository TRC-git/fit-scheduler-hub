import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, Phone, Receipt, Image } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BusinessDetails = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { data: businessLocation, isLoading } = useQuery({
    queryKey: ['businessLocation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesslocations')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (formData: {
      business_name?: string;
      phone_number?: string;
      tax_id?: string;
      address?: string;
      logo_url?: string;
    }) => {
      const { error } = await supabase
        .from('businesslocations')
        .update(formData)
        .eq('locationid', businessLocation?.locationid);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessLocation'] });
      toast({
        title: "Success",
        description: "Business details updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update business details",
        variant: "destructive",
      });
      console.error("Error updating business details:", error);
    }
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates = {
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
              <Building2 className="w-5 h-5 text-fitness-accent" />
              <div className="flex-1">
                <Label htmlFor="address" className="text-fitness-text">Address</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={businessLocation?.address || ''}
                  className="bg-fitness-inner text-fitness-text border-fitness-muted"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Image className="w-5 h-5 text-fitness-accent" />
              <div className="flex-1">
                <Label htmlFor="logo" className="text-fitness-text">Business Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="bg-fitness-inner text-fitness-text border-fitness-muted"
                />
              </div>
            </div>

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