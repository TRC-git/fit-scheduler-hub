'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClassType, CreateClassTypeData, UpdateClassTypeData } from "@/types/schedule/class-types";
import { useToast } from "@/components/ui/use-toast";

export const useClassTypes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: classTypes, isLoading } = useQuery({
    queryKey: ["classTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("class_types")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ClassType[];
    },
  });

  const createClassType = useMutation({
    mutationFn: async (data: CreateClassTypeData) => {
      const { error } = await supabase.from("class_types").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classTypes"] });
      toast({
        title: "Success",
        description: "Class type created successfully",
      });
    },
  });

  const updateClassType = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateClassTypeData;
    }) => {
      const { error } = await supabase
        .from("class_types")
        .update(data)
        .eq("class_type_id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classTypes"] });
      toast({
        title: "Success",
        description: "Class type updated successfully",
      });
    },
  });

  const deleteClassType = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("class_types")
        .delete()
        .eq("class_type_id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classTypes"] });
      toast({
        title: "Success",
        description: "Class type deleted successfully",
      });
    },
  });

  return {
    classTypes,
    isLoading,
    createClassType,
    updateClassType,
    deleteClassType,
  };
};