
import { usePositionsQuery } from "./usePositionsQuery";
import { useUpdatePermissionsMutation } from "./useUpdatePermissionsMutation";
import { useDeletePermissionsMutation } from "./useDeletePermissionsMutation";

export const usePermissions = () => {
  const { data: positions, isLoading } = usePositionsQuery();
  const updateAccessMutation = useUpdatePermissionsMutation();
  const deletePermissionsMutation = useDeletePermissionsMutation();

  return {
    positions,
    isLoading,
    updateAccess: updateAccessMutation.mutate,
    deletePermissions: deletePermissionsMutation.mutate
  };
};
