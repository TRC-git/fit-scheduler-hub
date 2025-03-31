
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";

interface StaffSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const StaffSelect = ({ value, onChange }: StaffSelectProps) => {
  const isMounted = useRef(true);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const { data: staff } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("isactive", true)
        .eq("suspended", false)
        .order("firstname");
      
      if (error) throw error;
      return data;
    },
    // Prevent query from automatically refetching when component unmounts
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    meta: {
      onError: (error: Error) => {
        if (isMounted.current) {
          console.error("Staff select error:", error);
        }
      }
    }
  });

  return (
    <div>
      <label className="text-sm font-medium text-fitness-text">Staff Name</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-[#333333] border-[#d1d1d1] text-fitness-text">
          <SelectValue placeholder="Select staff" />
        </SelectTrigger>
        <SelectContent className="bg-[#333333] border-[#d1d1d1]">
          {staff?.map((member) => (
            <SelectItem 
              key={member.employeeid}
              value={`${member.firstname} ${member.lastname}`}
              className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]"
            >
              {member.firstname} {member.lastname}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
