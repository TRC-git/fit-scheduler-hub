import { useStaffSubmitMutation } from "./mutations/useStaffSubmitMutation";
import { useStaffPayRateMutation } from "./mutations/useStaffPayRateMutation";
import { useStaffSuspendMutation } from "./mutations/useStaffSuspendMutation";
import { useStaffDeleteMutation } from "./mutations/useStaffDeleteMutation";

export const useStaffMutations = () => {
  const { submitStaffForm, loading } = useStaffSubmitMutation();
  const updatePayRateMutation = useStaffPayRateMutation();
  const suspendMutation = useStaffSuspendMutation();
  const deleteMutation = useStaffDeleteMutation();

  return {
    submitStaffForm,
    loading,
    updatePayRateMutation,
    suspendMutation,
    deleteMutation
  };
};