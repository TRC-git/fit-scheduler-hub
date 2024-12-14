import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduleSettings from "@/components/settings/ScheduleSettings";
import PositionSettings from "@/components/settings/PositionSettings";
import PayrollSettings from "@/components/settings/PayrollSettings";
import PermissionSettings from "@/components/settings/PermissionSettings";

const Settings = () => {
  return (
    <div className="flex flex-col min-h-screen bg-fitness-background">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-fitness-text mb-6">Settings</h1>
        
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="bg-fitness-card">
            <TabsTrigger value="schedule">Schedule Templates</TabsTrigger>
            <TabsTrigger value="positions">Positions & Wages</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="payroll">Payroll Settings</TabsTrigger>
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
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;