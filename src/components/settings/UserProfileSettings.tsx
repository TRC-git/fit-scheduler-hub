import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type UserProfile = {
  firstname: string;
  lastname: string;
  phonenumber: string | null;
  email: string;
  employeeid: number | null;
  is_admin: boolean;
};

const UserProfileSettings = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user, refreshAdminStatus } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        if (!user?.email) {
          throw new Error("User not authenticated");
        }
        
        // Check if user exists in employees table
        const { data: employee, error } = await supabase
          .from('employees')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (!employee) {
          // Create new employee record if not exists
          const userMetadata = user.user_metadata;
          
          const newEmployee = {
            email: user.email,
            firstname: userMetadata?.first_name || user.email.split('@')[0],
            lastname: userMetadata?.last_name || '',
            phonenumber: null,
            hiredate: new Date().toISOString().split('T')[0],
            is_admin: false
          };
          
          const { data: insertedEmployee, error: insertError } = await supabase
            .from('employees')
            .insert([newEmployee])
            .select()
            .single();
            
          if (insertError) {
            throw insertError;
          }
          
          setProfile(insertedEmployee);
          toast({
            title: "Profile Created",
            description: "Your employee profile has been created",
          });
        } else {
          setProfile(employee);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.email) {
      fetchUserProfile();
    }
  }, [user, toast]);

  const handleSave = async () => {
    if (!profile || !profile.employeeid) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('employees')
        .update({
          firstname: profile.firstname,
          lastname: profile.lastname,
          phonenumber: profile.phonenumber
        })
        .eq('employeeid', profile.employeeid);
        
      if (error) throw error;
      
      // Refresh admin status after profile update
      await refreshAdminStatus();
        
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string | boolean) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      [field]: value
    });
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-32 flex items-center justify-center">
            <p className="text-foreground">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {profile && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstname" className="text-foreground">First Name</Label>
                <Input
                  id="firstname"
                  value={profile.firstname}
                  onChange={(e) => handleChange('firstname', e.target.value)}
                  className="bg-background text-foreground border-border"
                />
              </div>
              <div>
                <Label htmlFor="lastname" className="text-foreground">Last Name</Label>
                <Input
                  id="lastname"
                  value={profile.lastname}
                  onChange={(e) => handleChange('lastname', e.target.value)}
                  className="bg-background text-foreground border-border"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                value={profile.email}
                readOnly
                className="bg-muted text-muted-foreground border-border"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phonenumber || ''}
                onChange={(e) => handleChange('phonenumber', e.target.value)}
                className="bg-background text-foreground border-border"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileSettings;
