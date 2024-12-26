import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PositionWithPayRate } from "../../positions/types";

interface StaffFormData {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
}

export const useStaffSubmitMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleEmployeePositions = async (
    employeeId: number,
    selectedPositions: PositionWithPayRate[]
  ) => {
    if (selectedPositions.length === 0) return;

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

    if (positionsError) {
      console.error("Error inserting positions:", positionsError);
      throw positionsError;
    }
  };

  const createStaffMember = async (
    formData: StaffFormData,
    selectedPositions: PositionWithPayRate[]
  ) => {
    const primaryPosition = selectedPositions[0]?.positionid || null;

    const { data: employeeData, error: employeeError } = await supabase
      .from("employees")
      .insert([
        {
          ...formData,
          hiredate: new Date().toISOString(),
          isactive: true,
          position_id: primaryPosition,
        },
      ])
      .select()
      .single();

    if (employeeError) {
      console.error("Error creating employee:", employeeError);
      throw employeeError;
    }

    await handleEmployeePositions(employeeData.employeeid, selectedPositions);
    return employeeData;
  };

  const updateStaffMember = async (
    employeeId: number,
    formData: StaffFormData,
    selectedPositions: PositionWithPayRate[]
  ) => {
    const primaryPosition = selectedPositions[0]?.positionid || null;

    const { error: employeeError } = await supabase
      .from("employees")
      .update({
        ...formData,
        isactive: true,
        position_id: primaryPosition,
      })
      .eq("employeeid", employeeId);

    if (employeeError) throw employeeError;

    const { error: deleteError } = await supabase
      .from("employeepositions")
      .delete()
      .eq("employeeid", employeeId);

    if (deleteError) throw deleteError;

    await handleEmployeePositions(employeeId, selectedPositions);
  };

  const submitStaffForm = async (
    formData: StaffFormData,
    selectedPositions: PositionWithPayRate[],
    initialData?: any
  ) => {
    setLoading(true);
    try {
      if (initialData) {
        await updateStaffMember(initialData.employeeid, formData, selectedPositions);
        toast({
          title: "Success",
          description: "Staff member updated successfully",
        });
      } else {
        await createStaffMember(formData, selectedPositions);
        toast({
          title: "Success",
          description: "Staff member added successfully",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      return true;
    } catch (error: any) {
      console.error("Error in submitStaffForm:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${initialData ? 'update' : 'add'} staff member`,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitStaffForm,
    loading
  };
};