import { useState } from "react";
import { StaffCard } from "./StaffCard";
import NewStaffDialog from "./NewStaffDialog";
import { StaffLoadingState } from "./components/StaffLoadingState";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import { useStaffQuery } from "./hooks/useStaffQuery";
import { useStaffMutations } from "./hooks/useStaffMutations";

const StaffList = () => {
  const [staffToDelete, setStaffToDelete] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: staff, isLoading, error } = useStaffQuery();
  const { updatePayRateMutation, suspendMutation, deleteMutation } = useStaffMutations();

  const handleEdit = (member: any) => {
    console.log("Editing member:", member);
    setSelectedStaff(member);
    setDialogOpen(true);
  };

  const handleUpdatePayRate = (employeeId: number, positionId: number, payRate: number) => {
    updatePayRateMutation.mutate({ employeeId, positionId, payRate });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedStaff(null);
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
    return <StaffLoadingState />;
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

      <DeleteConfirmDialog
        staffToDelete={staffToDelete}
        onClose={() => setStaffToDelete(null)}
        onConfirm={() => {
          deleteMutation.mutate(staffToDelete?.employeeid);
          setStaffToDelete(null);
        }}
      />

      <NewStaffDialog 
        open={dialogOpen} 
        onOpenChange={handleDialogClose}
        initialData={selectedStaff}
      />
    </>
  );
};

export default StaffList;