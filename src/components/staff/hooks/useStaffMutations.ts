import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PositionWithPayRate } from "../positions/types";
import { StaffResponse } from "../dialog/StaffDialogForm";

interface StaffFormData {
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  is_admin: boolean;
}

export const useStaffMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleEmployeePositions = async (
    employeeId: number,
    selectedPositions: PositionWithPayRate[]
  ) => {
    if (selectedPositions.length === 0) return;

    const { error: deleteError } = await supabase
      .from("employeepositions")
      .delete()
      .eq("employeeid", employeeId);

    if (deleteError) {
      console.error("Error deleting positions:", deleteError);
      throw deleteError;
    }

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

  const submitStaffForm = async (
    formData: StaffFormData,
    selectedPositions: PositionWithPayRate[],
    initialData?: any
  ): Promise<StaffResponse> => {
    setLoading(true);
    try {
      if (initialData) {
        const { data, error } = await supabase
          .from("employees")
          .update({
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            phonenumber: formData.phonenumber,
            is_admin: formData.is_admin
          })
          .eq("employeeid", initialData.employeeid)
          .select()
          .single();

        if (error) throw error;
        await handleEmployeePositions(initialData.employeeid, selectedPositions);
        
        toast({
          title: "Success",
          description: "Staff member updated successfully",
        });
        
        return data as StaffResponse;
      } else {
        const { data, error } = await supabase
          .from("employees")
          .insert([{
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            phonenumber: formData.phonenumber,
            hiredate: new Date().toISOString(),
            isactive: true,
            is_admin: formData.is_admin
          }])
          .select()
          .single();

        if (error) throw error;
        await handleEmployeePositions(data.employeeid, selectedPositions);
        
        toast({
          title: "Success",
          description: "Staff member added successfully",
        });
        
        return data as StaffResponse;
      }
    } catch (error: any) {
      console.error("Error in submitStaffForm:", error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${initialData ? 'update' : 'add'} staff member`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    }
  };

  return {
    submitStaffForm,
    loading
  };
};