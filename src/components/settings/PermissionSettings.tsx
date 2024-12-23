import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PermissionList } from "./permissions/PermissionList";
import type { Position, PermissionSettings, PositionWithPermissions } from "@/types/permissions";
import type { Json } from "@/types/database/common";

const defaultPermissions: PermissionSettings = {
  calendar_view: false,
  calendar_edit: false,
  calendar_manage: false,
  manage_employees: false,
  manage_positions: false,
  manage_payroll: false,
  approve_timesheets: false,
  view_reports: false,
  create_schedules: false,
  modify_schedules: false,
  approve_swaps: false,
  manage_settings: false,
  manage_locations: false
};

const PermissionSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: positions, isLoading } = useQuery<PositionWithPermissions[]>({
    queryKey: ['positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('*');
      
      if (error) throw error;
      
      return (data as Position[]).map(position => ({
        ...position,
        access_level: position.access_level ? {
          ...defaultPermissions,
          ...(position.access_level as PermissionSettings)
        } : defaultPermissions
      }));
    }
  });

  const updateAccessMutation = useMutation({
    mutationFn: async ({ positionId, access }: { positionId: string, access: PermissionSettings }) => {
      const { data, error } = await supabase
        .from('positions')
        .update({
          access_level: access as unknown as Json
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
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update permissions. Please try again.",
        variant: "destructive"
      });
      console.error("Error updating permissions:", error);
    }
  });

  const deletePermissionsMutation = useMutation({
    mutationFn: async (positionId: number) => {
      const { data, error } = await supabase
        .from('positions')
        .update({
          access_level: defaultPermissions
        })
        .eq('positionid', positionId);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position permissions reset successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['positions'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reset permissions. Please try again.",
        variant: "destructive"
      });
      console.error("Error resetting permissions:", error);
    }
  });

  const handleSavePermissions = (positionId: string, permissions: PermissionSettings) => {
    updateAccessMutation.mutate({
      positionId,
      access: permissions
    });
  };

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Permission Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mt-8">
          <PermissionList
            positions={positions || []}
            onEdit={() => {}}
            onDelete={(positionId) => deletePermissionsMutation.mutate(positionId)}
            onSave={handleSavePermissions}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionSettings;