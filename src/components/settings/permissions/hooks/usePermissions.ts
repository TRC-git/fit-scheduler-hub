
import { usePositionsQuery } from "./usePositionsQuery";
import { useUpdatePermissionsMutation } from "./useUpdatePermissionsMutation";
import { useDeletePermissionsMutation } from "./useDeletePermissionsMutation";
import { useMemo } from "react";

export const usePermissions = () => {
  const { 
    data: positions, 
    isLoading, 
    isError, 
    error 
  } = usePositionsQuery();
  
  const updateAccessMutation = useUpdatePermissionsMutation();
  const deletePermissionsMutation = useDeletePermissionsMutation();

  // Use memoization to prevent unnecessary recalculations
  const memoizedPositions = useMemo(() => positions || [], [positions]);

  return {
    positions: memoizedPositions,
    isLoading,
    isError,
    error,
    updateAccess: updateAccessMutation.mutate,
    deletePermissions: deletePermissionsMutation.mutate
  };
};
