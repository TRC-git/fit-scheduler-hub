import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const StaffList = () => {
  const { toast } = useToast();
  
  const { data: staff, isLoading, error } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
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
      
      return data;
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
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StaffList;