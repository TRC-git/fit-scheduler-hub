import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { PermissionForm } from "./permissions/PermissionForm";
import { PermissionList } from "./permissions/PermissionList";
import { Position, PermissionSettings as PermissionSettingsType } from "@/types/permissions";

const PermissionSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [permissions, setPermissions] = useState<PermissionSettingsType>({
    calendar_view: false,
    calendar_edit: false,
    calendar_manage: false,
    manage_employees: false,
    manage_positions: false,
    manage_payroll: false
  });

  const { data: positions } = useQuery<Position[]>({
    queryKey: ['positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('*');
      
      if (error) throw error;
      return data as Position[];
    }
  });

  const updateAccessMutation = useMutation({
    mutationFn: async ({ positionId, access }: { positionId: string, access: PermissionSettingsType }) => {
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

  const handleEdit = (position: Position) => {
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

  const handlePermissionChange = (key: keyof PermissionSettingsType, value: boolean) => {
    setPermissions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Permission Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PermissionForm
          positions={positions || []}
          selectedPosition={selectedPosition}
          permissions={permissions}
          onPositionChange={setSelectedPosition}
          onPermissionChange={handlePermissionChange}
        />

        <Button 
          className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 w-full"
          onClick={() => updateAccessMutation.mutate({
            positionId: selectedPosition,
            access: permissions
          })}
        >
          Save Permissions
        </Button>

        <div className="mt-8">
          <Label className="text-fitness-text mb-4 block">Current Permissions</Label>
          <PermissionList
            positions={positions || []}
            onEdit={handleEdit}
            onDelete={(positionId) => deletePermissionsMutation.mutate(positionId)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionSettings;