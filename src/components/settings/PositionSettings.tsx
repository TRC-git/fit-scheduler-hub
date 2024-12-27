import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PositionDialog } from "./positions/PositionDialog";
import { usePositionMutations } from "./positions/hooks/usePositionMutations";
import { usePositionsQuery } from "./positions/hooks/usePositionsQuery";
import { PositionList } from "./positions/components/PositionList";

const PositionSettings = () => {
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: positions, error: queryError } = usePositionsQuery();
  const { createPositionMutation, updatePositionMutation, deletePositionMutation } = usePositionMutations(() => {
    setIsDialogOpen(false);
    setSelectedPosition(null);
  });

  const handleSubmit = (positionData: any) => {
    console.log('Handling submit with data:', positionData);
    if (selectedPosition) {
      updatePositionMutation.mutate({
        ...positionData,
        positionid: selectedPosition.positionid
      });
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
        <PositionList
          positions={positions || []}
          onEdit={(position) => {
            setSelectedPosition(position);
            setIsDialogOpen(true);
          }}
          onDelete={(positionId) => deletePositionMutation.mutate(positionId)}
        />
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