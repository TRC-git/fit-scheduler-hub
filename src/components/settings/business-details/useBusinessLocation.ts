import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BusinessLocation, BusinessLocationUpdate } from "./types";
import { useToast } from "@/components/ui/use-toast";

export const useBusinessLocation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: businessLocation, isLoading } = useQuery({
    queryKey: ['businessLocation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesslocations')
        .select('*')
        .single();
      
      if (error) throw error;
      return data as BusinessLocation;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (formData: BusinessLocationUpdate) => {
      const { error } = await supabase
        .from('businesslocations')
        .update(formData)
        .eq('locationid', businessLocation?.locationid);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessLocation'] });
      toast({
        title: "Success",
        description: "Business details updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update business details",
        variant: "destructive",
      });
      console.error("Error updating business details:", error);
    }
  });

  return {
    businessLocation,
    isLoading,
    updateMutation
  };
};