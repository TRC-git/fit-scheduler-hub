import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

const PermissionSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [permissions, setPermissions] = useState({
    calendar_view: false,
    calendar_edit: false,
    calendar_manage: false,
    manage_employees: false,
    manage_positions: false,
    manage_payroll: false
  });

  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('*');
      
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
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      setSelectedPosition("");
      setPermissions({
        calendar_view: false,
        calendar_edit: false,
        calendar_manage: false,
        manage_employees: false,
        manage_positions: false,
        manage_payroll: false
      });
    },
  });

  const deletePermissionsMutation = useMutation({
    mutationFn: async (positionId: number) => {
      const { data, error } = await supabase
        .from('positions')
        .update({
          access_level: null
        })
        .eq('positionid', positionId);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position permissions removed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
  });

  const handleEdit = (position: any) => {
    setSelectedPosition(position.positionid.toString());
    setPermissions(position.access_level || {
      calendar_view: false,
      calendar_edit: false,
      calendar_manage: false,
      manage_employees: false,
      manage_positions: false,
      manage_payroll: false
    });
  };

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Permission Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label className="text-fitness-text">Select Position</Label>
            <Select 
              value={selectedPosition} 
              onValueChange={setSelectedPosition}
            >
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
                  checked={permissions.calendar_view}
                  onCheckedChange={(checked) => 
                    setPermissions(prev => ({ ...prev, calendar_view: checked as boolean }))
                  }
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="view-schedule" className="text-fitness-text">
                  View Schedule
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="edit-schedule"
                  checked={permissions.calendar_edit}
                  onCheckedChange={(checked) => 
                    setPermissions(prev => ({ ...prev, calendar_edit: checked as boolean }))
                  }
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="edit-schedule" className="text-fitness-text">
                  Edit Schedule
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="manage-schedule"
                  checked={permissions.calendar_manage}
                  onCheckedChange={(checked) => 
                    setPermissions(prev => ({ ...prev, calendar_manage: checked as boolean }))
                  }
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
                  checked={permissions.manage_employees}
                  onCheckedChange={(checked) => 
                    setPermissions(prev => ({ ...prev, manage_employees: checked as boolean }))
                  }
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="manage-employees" className="text-fitness-text">
                  Manage Employees
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="manage-positions"
                  checked={permissions.manage_positions}
                  onCheckedChange={(checked) => 
                    setPermissions(prev => ({ ...prev, manage_positions: checked as boolean }))
                  }
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="manage-positions" className="text-fitness-text">
                  Manage Positions
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="manage-payroll"
                  checked={permissions.manage_payroll}
                  onCheckedChange={(checked) => 
                    setPermissions(prev => ({ ...prev, manage_payroll: checked as boolean }))
                  }
                  className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
                />
                <Label htmlFor="manage-payroll" className="text-fitness-text">
                  Manage Payroll
                </Label>
              </div>
            </div>
          </div>

          <Button 
            className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 inline-flex w-auto"
            onClick={() => updateAccessMutation.mutate({
              positionId: selectedPosition,
              access: permissions
            })}
          >
            Save Permissions
          </Button>

          <div className="mt-8">
            <Label className="text-fitness-text mb-4 block">Current Permissions</Label>
            <div className="space-y-4">
              {positions?.map((position: any) => position.access_level && (
                <div key={position.positionid} className="bg-fitness-inner p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-fitness-text font-medium">{position.positionname}</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(position)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4 text-fitness-text" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePermissionsMutation.mutate(position.positionid)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-fitness-text/70">
                    {Object.entries(position.access_level).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionSettings;