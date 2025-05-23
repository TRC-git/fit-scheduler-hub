import { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import NewStaffDialog from "@/components/staff/NewStaffDialog";
import StaffList from "@/components/staff/StaffList";
import SyncedStaffList from "@/components/staff/SyncedStaffList";

const Staff = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-fitness-background">
      <Header />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-fitness-text">Staff Management</h1>
          <Button 
            onClick={() => setDialogOpen(true)}
            className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Staff
          </Button>
        </div>
        
        {/* GoHighLevel Synced Staff */}
        <SyncedStaffList />
        
        {/* Local Staff List */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-fitness-text mb-4">Local Staff</h2>
          <StaffList />
        </div>
        
        <NewStaffDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </main>
    </div>
  );
};

export default Staff;