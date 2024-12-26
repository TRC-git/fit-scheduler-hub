import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { StaffCard } from "./StaffCard";
import NewStaffDialog from "./NewStaffDialog";

const StaffList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [staffToDelete, setStaffToDelete] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: staff, isLoading, error } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      console.log("Fetching staff members...");
      try {
        const { data: staffData, error: staffError } = await supabase
          .from("employees")
          .select(`
            *,
            employeepositions (
              payrate,
              is_primary,
              positions (
                positionid,
                positionname,
                access_level
              )
            ),
            positions:employees_position_id_fkey (
              positionid,
              positionname
            )
          `)
          .eq("isactive", true)
          .order("firstname");
        
        if (staffError) {
          console.error("Error fetching staff:", staffError);
          throw staffError;
        }
        
        console.log("Staff data:", staffData);
        return staffData;
      } catch (error) {
        console.error("Error in staff query:", error);
        throw error;
      }
    },
    retry: 1,
  });

  const updatePayRateMutation = useMutation({
    mutationFn: async ({ 
      employeeId, 
      positionId, 
      payRate 
    }: { 
      employeeId: number; 
      positionId: number; 
      payRate: number 
    }) => {
      console.log('Updating pay rate:', { employeeId, positionId, payRate });
      const { data, error } = await supabase
        .from('employeepositions')
        .update({ 
          payrate: payRate,
          custom_payrate: payRate 
        })
        .eq('employeeid', employeeId)
        .eq('positionid', positionId);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: "Success",
        description: "Pay rate updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating pay rate:', error);
      toast({
        title: "Error",
        description: "Failed to update pay rate",
        variant: "destructive",
      });
    }
  });

  const suspendMutation = useMutation({
    mutationFn: async ({ employeeId, suspend }: { employeeId: number, suspend: boolean }) => {
      const { error } = await supabase
        .from("employees")
        .update({ suspended: suspend })
        .eq("employeeid", employeeId);
      
      if (error) throw error;
    },
    onSuccess: (_, { suspend }) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Success",
        description: `Staff member ${suspend ? 'suspended' : 'resumed'} successfully`,
      });
    },
    onError: (error) => {
      console.error("Error in suspend mutation:", error);
      toast({
        title: "Error",
        description: "Failed to update staff member status",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (employeeId: number) => {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("employeeid", employeeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
      setStaffToDelete(null);
    },
    onError: (error) => {
      console.error("Error in delete mutation:", error);
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (member: any) => {
    console.log("Editing member:", member);
    setSelectedStaff(member);
    setDialogOpen(true);
  };

  const handleUpdatePayRate = (employeeId: number, positionId: number, payRate: number) => {
    updatePayRateMutation.mutate({ employeeId, positionId, payRate });
  };

  if (error) {
    console.error("Staff list error:", error);
    return (
      <div className="p-4 text-red-500 bg-red-100 rounded">
        Failed to load staff members. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-4 bg-fitness-card animate-pulse h-32" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff?.map((member) => (
          <StaffCard
            key={member.employeeid}
            member={member}
            onEdit={handleEdit}
            onSuspend={(employeeId, suspend) => 
              suspendMutation.mutate({ employeeId, suspend })
            }
            onDelete={setStaffToDelete}
            onUpdatePayRate={handleUpdatePayRate}
          />
        ))}
      </div>

      <AlertDialog open={!!staffToDelete} onOpenChange={() => setStaffToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete {staffToDelete?.firstname} {staffToDelete?.lastname}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteMutation.mutate(staffToDelete?.employeeid)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <NewStaffDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        initialData={selectedStaff}
      />
    </>
  );
};

export default StaffList;
