import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Upload, CheckCircle2 } from "lucide-react";

export const DirectDepositSection = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch existing direct deposit info
  const { data: directDepositInfo } = useQuery({
    queryKey: ['directDepositInfo'],
    queryFn: async () => {
      const { data: employeeData } = await supabase
        .from('employees')
        .select('employeeid')
        .eq('email', (await supabase.auth.getUser()).data.user?.email)
        .single();

      if (!employeeData) throw new Error('Employee not found');

      const { data } = await supabase
        .from('direct_deposit_info')
        .select('*')
        .eq('employee_id', employeeData.employeeid)
        .single();

      return data;
    }
  });

  // Mutation for saving direct deposit info
  const saveMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data: employeeData } = await supabase
        .from('employees')
        .select('employeeid')
        .eq('email', (await supabase.auth.getUser()).data.user?.email)
        .single();

      if (!employeeData) throw new Error('Employee not found');

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const filePath = `${employeeData.employeeid}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('direct_deposit_forms')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from('direct_deposit_info')
          .upsert({
            employee_id: employeeData.employeeid,
            bank_name: formData.get('bankName'),
            account_type: formData.get('accountType'),
            routing_number: formData.get('routingNumber'),
            account_number: formData.get('accountNumber'),
            form_file_path: filePath,
            is_verified: false
          });

        if (dbError) throw dbError;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Direct deposit information saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save direct deposit information",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    saveMutation.mutate(formData);
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
            <div className="space-y-2">
              <Label className="text-fitness-text">Bank Name</Label>
              <Input
                name="bankName"
                placeholder="Enter bank name"
                defaultValue={directDepositInfo?.bank_name}
                className="bg-fitness-inner text-fitness-text"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-fitness-text">Account Type</Label>
              <select
                name="accountType"
                defaultValue={directDepositInfo?.account_type}
                className="w-full h-10 rounded-md border border-input bg-fitness-inner px-3 py-2 text-fitness-text"
                required
              >
                <option value="">Select account type</option>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-fitness-text">Routing Number</Label>
              <Input
                name="routingNumber"
                placeholder="Enter routing number"
                defaultValue={directDepositInfo?.routing_number}
                className="bg-fitness-inner text-fitness-text"
                required
                pattern="^\d{9}$"
                title="Routing number must be 9 digits"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-fitness-text">Account Number</Label>
              <Input
                name="accountNumber"
                placeholder="Enter account number"
                defaultValue={directDepositInfo?.account_number}
                className="bg-fitness-inner text-fitness-text"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-fitness-text">Direct Deposit Form</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="bg-fitness-inner text-fitness-text"
                />
                {directDepositInfo?.is_verified && (
                  <div className="flex items-center text-green-500">
                    <CheckCircle2 className="w-5 h-5 mr-1" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>

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