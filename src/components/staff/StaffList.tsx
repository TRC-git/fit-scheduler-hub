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
      const { data, error } = await supabase
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
          )
        `)
        .eq("isactive", true)
        .order("firstname");
      
      if (error) {
        console.error("Error fetching staff:", error);
        toast({
          title: "Error",
          description: "Failed to load staff members",
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Staff data:", data);
      return data;
    },
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
  });

  const handleEdit = (member: any) => {
    console.log("Editing member:", member); // Add this for debugging
    setSelectedStaff(member);
    setDialogOpen(true);
  };

  if (error) {
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