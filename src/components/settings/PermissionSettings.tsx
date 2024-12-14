import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PermissionSettings = () => {
  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Permission Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label className="text-fitness-text">Select Employee</Label>
            <Select>
              <SelectTrigger className="bg-fitness-inner text-fitness-text">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Heath Graham</SelectItem>
                <SelectItem value="2">Ted Gonder</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-fitness-text mb-2">Permissions</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="view-schedule"
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="view-schedule" className="text-fitness-text">
                  View Schedule
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="edit-schedule"
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="edit-schedule" className="text-fitness-text">
                  Edit Schedule
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="manage-employees"
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="manage-employees" className="text-fitness-text">
                  Manage Employees
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="view-payroll"
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="view-payroll" className="text-fitness-text">
                  View Payroll
                </Label>
              </div>
            </div>
          </div>

          <Button className="bg-[#15e7fb] hover:bg-[#15e7fb]/80">
            Save Permissions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionSettings;