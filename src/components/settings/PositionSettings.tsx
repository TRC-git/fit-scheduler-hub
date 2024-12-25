import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { PositionDialog } from "./positions/PositionDialog";
import { PositionCard } from "./positions/PositionCard";

const PositionSettings = () => {
  const { toast } = useToast();
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: positions, refetch } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const createPositionMutation = useMutation({
    mutationFn: async (positionData: any) => {
      const { data, error } = await supabase
        .from('positions')
        .insert([positionData]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position created successfully",
      });
      refetch();
      setIsDialogOpen(false);
    },
  });

  const updatePositionMutation = useMutation({
    mutationFn: async (positionData: any) => {
      const { data, error } = await supabase
        .from('positions')
        .update(positionData)
        .eq('positionid', selectedPosition.positionid);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position updated successfully",
      });
      refetch();
      setIsDialogOpen(false);
      setSelectedPosition(null);
    },
  });

  const deletePositionMutation = useMutation({
    mutationFn: async (positionId: number) => {
      const { error } = await supabase
        .from('positions')
        .delete()
        .eq('positionid', positionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position deleted successfully",
      });
      refetch();
    },
  });

  const handleSubmit = (positionData: any) => {
    if (selectedPosition) {
      updatePositionMutation.mutate(positionData);
    } else {
      createPositionMutation.mutate(positionData);
    }
  };

  return (
    <Card className="bg-fitness-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-fitness-text">Positions & Wages</CardTitle>
        <Button 
          className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
          onClick={() => {
            setSelectedPosition(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Position
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {positions?.map((position: any) => (
            <PositionCard
              key={position.positionid}
              position={position}
              onEdit={() => {
                setSelectedPosition(position);
                setIsDialogOpen(true);
              }}
              onDelete={() => deletePositionMutation.mutate(position.positionid)}
            />
          ))}
        </div>
      </CardContent>

      <PositionDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedPosition={selectedPosition}
        onSubmit={handleSubmit}
      />
    </Card>
  );
};

export default PositionSettings;