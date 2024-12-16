import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import ScheduleSettings from "../components/settings/ScheduleSettings"
import PositionSettings from "../components/settings/PositionSettings"
import PayrollSettings from "../components/settings/PayrollSettings"
import PermissionSettings from "../components/settings/PermissionSettings"

export default function SettingsPage() {
  return (
    <Tabs defaultValue="schedule" className="w-full">
      <TabsList>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="position">Position</TabsTrigger>
        <TabsTrigger value="payroll">Payroll</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>
      <TabsContent value="schedule">
        <ScheduleSettings />
      </TabsContent>
      <TabsContent value="position">
        <PositionSettings />
      </TabsContent>
      <TabsContent value="payroll">
        <PayrollSettings />
      </TabsContent>
      <TabsContent value="permissions">
        <PermissionSettings />
      </TabsContent>
    </Tabs>
  )
}
