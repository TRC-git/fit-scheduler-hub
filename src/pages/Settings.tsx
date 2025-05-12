
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduleSettings from "@/components/settings/ScheduleSettings";
import PositionSettings from "@/components/settings/PositionSettings";
import PayrollSettings from "@/components/settings/PayrollSettings";
import PermissionSettings from "@/components/settings/PermissionSettings";
import BusinessDetails from "@/components/settings/BusinessDetails";
import APIKeysSettings from "@/components/settings/APIKeysSettings";
import UserProfileSettings from "@/components/settings/UserProfileSettings";
import { OperationalDaysProvider } from "@/contexts/operational-days/OperationalDaysContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.email) return;

        const { data: employee } = await supabase
          .from('employees')
          .select('is_admin')
          .eq('email', session.user.email)
          .maybeSingle();

        setIsAdmin(!!employee?.is_admin);
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);
  
  if (loading) {
    return <div className="flex flex-col min-h-screen bg-fitness-background">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-fitness-text hover:text-[#15e7fb] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Schedule
          </Link>
          <h1 className="text-2xl font-bold text-fitness-text">Settings</h1>
        </div>
        <p className="text-fitness-text">Loading...</p>
      </div>
    </div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-fitness-background">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-fitness-text hover:text-[#15e7fb] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Schedule
          </Link>
          <h1 className="text-2xl font-bold text-fitness-text">Settings</h1>
        </div>
        
        <OperationalDaysProvider>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-fitness-card">
              <TabsTrigger value="profile">User Profile</TabsTrigger>
              {isAdmin && (
                <>
                  <TabsTrigger value="schedule">Schedule Templates</TabsTrigger>
                  <TabsTrigger value="positions">Positions & Wages</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="payroll">Payroll Settings</TabsTrigger>
                  <TabsTrigger value="business">Business Details</TabsTrigger>
                  <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                </>
              )}
            </TabsList>
            
            <TabsContent value="profile">
              <UserProfileSettings />
            </TabsContent>
            
            {isAdmin && (
              <>
                <TabsContent value="schedule">
                  <ScheduleSettings />
                </TabsContent>
                
                <TabsContent value="positions">
                  <PositionSettings />
                </TabsContent>
                
                <TabsContent value="permissions">
                  <PermissionSettings />
                </TabsContent>
                
                <TabsContent value="payroll">
                  <PayrollSettings />
                </TabsContent>

                <TabsContent value="business">
                  <BusinessDetails />
                </TabsContent>

                <TabsContent value="api-keys">
                  <APIKeysSettings />
                </TabsContent>
              </>
            )}
          </Tabs>
        </OperationalDaysProvider>
      </div>
    </div>
  );
};

export default Settings;
