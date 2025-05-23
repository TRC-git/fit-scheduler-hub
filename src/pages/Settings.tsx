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
import SyncedUsersSettings from "@/components/settings/SyncedUsersSettings";
import { OperationalDaysProvider } from "@/contexts/operational-days/OperationalDaysContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Integrations from "./Integrations";
import { useLocation } from "react-router-dom";

const Settings = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  
  // Determine the default tab based on URL parameters
  const getDefaultTab = () => {
    if (tabParam && ['profile', 'schedule', 'positions', 'permissions', 
                     'payroll', 'business', 'api-keys', 'integrations'].includes(tabParam)) {
      return tabParam;
    }
    return 'profile';
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log("Checking admin status...");
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.email) {
          console.log("No user session found");
          setLoading(false);
          return;
        }

        console.log("Fetching employee data for:", session.user.email);
        const { data: employee, error } = await supabase
          .from('employees')
          .select('is_admin')
          .eq('email', session.user.email)
          .maybeSingle();

        if (error) {
          console.error('Error fetching employee data:', error);
        }

        const adminStatus = !!employee?.is_admin;
        console.log("Admin status:", adminStatus);
        setIsAdmin(adminStatus);
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
          <Tabs defaultValue={getDefaultTab()} className="w-full">
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
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                </>
              )}
            </TabsList>
            
            <TabsContent value="profile">
              <div className="space-y-6">
                <UserProfileSettings />
                <SyncedUsersSettings />
              </div>
            </TabsContent>
            
            {isAdmin ? (
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

                <TabsContent value="integrations">
                  <Integrations />
                </TabsContent>
              </>
            ) : tabParam && tabParam !== 'profile' ? (
              <div className="p-4 bg-red-500/10 text-red-500 rounded-md mt-4">
                You need administrator privileges to access this section.
              </div>
            ) : null}
          </Tabs>
        </OperationalDaysProvider>
      </div>
    </div>
  );
};

export default Settings;
