import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
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
import { Pencil, Pause, Trash2 } from "lucide-react";
import { useState } from "react";

const StaffList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [staffToDelete, setStaffToDelete] = useState<any>(null);
  
  const { data: staff, isLoading, error } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      console.log("Fetching staff members...");
      const { data, error } = await supabase
        .from("employees")
        .select(`
          *,
          employeepositions (
            positions (positionname)
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
    mutationFn: async (employeeId: number) => {
      const { error } = await supabase
        .from("employees")
        .update({ isactive: false })
        .eq("employeeid", employeeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Success",
        description: "Staff member suspended successfully",
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
          <Card key={member.employeeid} className="p-4 bg-fitness-card">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <div className="w-full h-full bg-fitness-accent flex items-center justify-center text-white font-semibold">
                  {member.firstname[0]}{member.lastname[0]}
                </div>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-fitness-text font-medium">
                  {member.firstname} {member.lastname}
                </h3>
                <p className="text-sm text-gray-400">{member.email}</p>
                <p className="text-sm text-gray-400">{member.phonenumber}</p>
                {member.employeepositions?.[0]?.positions?.positionname && (
                  <p className="text-xs text-fitness-accent mt-1">
                    {member.employeepositions[0].positions.positionname}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#15e7fb]"
                  onClick={() => {
                    toast({
                      title: "Edit",
                      description: "Edit functionality coming soon",
                    });
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-yellow-500"
                  onClick={() => suspendMutation.mutate(member.employeeid)}
                >
                  <Pause className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-fitness-danger"
                  onClick={() => setStaffToDelete(member)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
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
    </>
  );
};

export default StaffList;