
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduleSettings from "@/components/settings/ScheduleSettings";
import PositionSettings from "@/components/settings/PositionSettings";
import PayrollSettings from "@/components/settings/PayrollSettings";
import PermissionSettings from "@/components/settings/PermissionSettings";
import BusinessDetails from "@/components/settings/BusinessDetails";
import APIKeysSettings from "@/components/settings/APIKeysSettings";
import { OperationalDaysProvider } from "@/contexts/operational-days/OperationalDaysContext";

const Settings = () => {
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
          <Tabs defaultValue="schedule" className="w-full">
            <TabsList className="bg-fitness-card">
              <TabsTrigger value="schedule">Schedule Templates</TabsTrigger>
              <TabsTrigger value="positions">Positions & Wages</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="payroll">Payroll Settings</TabsTrigger>
              <TabsTrigger value="business">Business Details</TabsTrigger>
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            </TabsList>
            
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
          </Tabs>
        </OperationalDaysProvider>
      </div>
    </div>
  );
};

export default Settings;
