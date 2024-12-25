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

  const { data: positions, refetch, error: queryError } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      console.log('Fetching positions...');
      const { data, error } = await supabase
        .from('positions')
        .select('*');
      
      if (error) {
        console.error('Error fetching positions:', error);
        throw error;
      }
      console.log('Positions fetched:', data);
      return data;
    }
  });

  const createPositionMutation = useMutation({
    mutationFn: async (positionData: any) => {
      console.log('Creating position:', positionData);
      const { data, error } = await supabase
        .from('positions')
        .insert([positionData]);
      
      if (error) {
        console.error('Error creating position:', error);
        throw error;
      }
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
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to create position. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updatePositionMutation = useMutation({
    mutationFn: async (positionData: any) => {
      console.log('Updating position:', positionData);
      const { data, error } = await supabase
        .from('positions')
        .update(positionData)
        .eq('positionid', selectedPosition.positionid);
      
      if (error) {
        console.error('Error updating position:', error);
        throw error;
      }
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
    onError: (error) => {
      console.error('Update mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to update position. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deletePositionMutation = useMutation({
    mutationFn: async (positionId: number) => {
      console.log('Deleting position:', positionId);
      const { error } = await supabase
        .from('positions')
        .delete()
        .eq('positionid', positionId);
      
      if (error) {
        console.error('Error deleting position:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position deleted successfully",
      });
      refetch();
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to delete position. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (positionData: any) => {
    console.log('Handling submit with data:', positionData);
    if (selectedPosition) {
      updatePositionMutation.mutate(positionData);
    } else {
      createPositionMutation.mutate(positionData);
    }
  };

  if (queryError) {
    console.error('Query error:', queryError);
    return (
      <Card className="bg-fitness-card">
        <CardContent className="p-6">
          <p className="text-red-500">Error loading positions. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

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