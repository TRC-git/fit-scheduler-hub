import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface NewStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewStaffDialog = ({ open, onOpenChange }: NewStaffDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase
        .from("employees")
        .insert([
          {
            ...formData,
            hiredate: new Date().toISOString(),
            isactive: true,
          },
        ]);

      if (error) {
        console.error("Error creating employee:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Staff member added successfully",
      });
      
      // Invalidate and refetch staff list
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      
      onOpenChange(false);
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        phonenumber: "",
      });
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add staff member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-fitness-card border-fitness-muted">
        <DialogHeader>
          <DialogTitle className="text-fitness-text">Add New Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname" className="text-fitness-text">First Name</Label>
              <Input
                id="firstname"
                value={formData.firstname}
                onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
                className="bg-fitness-inner text-fitness-text"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-fitness-text">Last Name</Label>
              <Input
                id="lastname"
                value={formData.lastname}
                onChange={(e) => setFormData(prev => ({ ...prev, lastname: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, phonenumber: e.target.value }))}
              className="bg-fitness-inner text-fitness-text"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-fitness-text"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
            >
              {loading ? "Adding..." : "Add Staff Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewStaffDialog;