
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionList } from "./permissions/PermissionList";
import { usePermissions } from "./permissions/hooks/usePermissions";
import type { PermissionSettingsType } from "@/types/permissions";

const PermissionSettings = () => {
  const { positions, isLoading, updateAccess, deletePermissions } = usePermissions();

  const handleSavePermissions = (positionId: number, permissions: PermissionSettingsType) => {
    updateAccess({
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
            onDelete={deletePermissions}
            onSave={handleSavePermissions}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionSettings;
