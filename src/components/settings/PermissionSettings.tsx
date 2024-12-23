import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PermissionSettings = () => {
  const { toast } = useToast();

  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select(`
          *,
          employeepositions (
            access_level
          )
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const updateAccessMutation = useMutation({
    mutationFn: async ({ positionId, access }: any) => {
      const { data, error } = await supabase
        .from('positions')
        .update({
          access_level: access
        })
        .eq('positionid', positionId);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position permissions updated successfully",
      });
    },
  });

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Permission Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label className="text-fitness-text">Select Position</Label>
            <Select>
              <SelectTrigger className="bg-fitness-inner text-fitness-text">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {positions?.map((position: any) => (
                  <SelectItem 
                    key={position.positionid} 
                    value={position.positionid.toString()}
                  >
                    {position.positionname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-fitness-text mb-2">Calendar Access</Label>
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
                  id="manage-schedule"
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="manage-schedule" className="text-fitness-text">
                  Manage Schedule Templates
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-fitness-text mb-2">System Access</Label>
            <div className="space-y-2">
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
                  id="manage-positions"
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="manage-positions" className="text-fitness-text">
                  Manage Positions
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="manage-payroll"
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="manage-payroll" className="text-fitness-text">
                  Manage Payroll
                </Label>
              </div>
            </div>
          </div>

          <Button 
            className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
            onClick={() => updateAccessMutation.mutate({
              positionId: 1,
              access: {
                calendar_view: true,
                calendar_edit: true,
                calendar_manage: false,
                manage_employees: false,
                manage_positions: false,
                manage_payroll: false
              }
            })}
          >
            Save Permissions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionSettings;