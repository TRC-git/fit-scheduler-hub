import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PositionWithPayRate } from "../../positions/types";

interface StaffFormData {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  is_admin: boolean;
}

interface MutationParams {
  formData: StaffFormData;
  selectedPositions: PositionWithPayRate[];
  initialData?: any;
}

export const useStaffSubmitMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleEmployeePositions = async (
    employeeId: number,
    selectedPositions: PositionWithPayRate[]
  ) => {
    if (selectedPositions.length === 0) return;

    const { error: deleteError } = await supabase
      .from("employeepositions")
      .delete()
      .eq("employeeid", employeeId);

    if (deleteError) throw deleteError;

    const positionsToInsert = selectedPositions.map((position, index) => ({
      employeeid: employeeId,
      positionid: position.positionid,
      payrate: position.payrate || position.defaultpayrate || 0,
      is_primary: index === 0,
      access_level: position.access_level ? JSON.stringify(position.access_level) : 'basic'
    }));

    const { error: positionsError } = await supabase
      .from("employeepositions")
      .insert(positionsToInsert);

    if (positionsError) throw positionsError;
  };

  return useMutation<number, Error, MutationParams, unknown>({
    mutationFn: async ({
      formData,
      selectedPositions,
      initialData
    }) => {
      if (initialData) {
        const { error } = await supabase
          .from("employees")
          .update({
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            phonenumber: formData.phonenumber,
            is_admin: formData.is_admin
          })
          .eq("employeeid", initialData.employeeid);

        if (error) throw error;

        await handleEmployeePositions(initialData.employeeid, selectedPositions);
        return initialData.employeeid;
      } else {
        const { data, error } = await supabase
          .from("employees")
          .insert([
            {
              ...formData,
              hiredate: new Date().toISOString(),
              isactive: true,
              position_id: selectedPositions[0]?.positionid || null,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        await handleEmployeePositions(data.employeeid, selectedPositions);
        return data.employeeid;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Success",
        description: "Staff member saved successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Error in staff mutation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save staff member",
        variant: "destructive",
      });
    },
  });
};