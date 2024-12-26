import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Position {
  positionid: number;
  positionname: string;
  defaultpayrate: number | null;
  access_level: any;
}

interface PositionSelectProps {
  selectedPositions: Position[];
  onPositionsChange: (positions: Position[]) => void;
}

export const PositionSelect = ({ selectedPositions, onPositionsChange }: PositionSelectProps) => {
  const [currentPosition, setCurrentPosition] = useState<string>("");

  const { data: positions } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("positions")
        .select("*")
        .order("positionname");
      
      if (error) throw error;
      return data as Position[];
    }
  });

  const handleAddPosition = () => {
    const position = positions?.find(p => p.positionid.toString() === currentPosition);
    if (position && !selectedPositions.find(p => p.positionid === position.positionid)) {
      onPositionsChange([...selectedPositions, position]);
      setCurrentPosition("");
    }
  };

  const handleRemovePosition = (positionId: number) => {
    onPositionsChange(selectedPositions.filter(p => p.positionid !== positionId));
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-fitness-text">Positions</label>
      <div className="flex gap-2">
        <Select value={currentPosition} onValueChange={setCurrentPosition}>
          <SelectTrigger className="bg-fitness-inner text-fitness-text flex-1">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent className="bg-fitness-inner border-fitness-muted">
            {positions?.filter(position => 
              !selectedPositions.find(p => p.positionid === position.positionid)
            ).map((position) => (
              <SelectItem 
                key={position.positionid} 
                value={position.positionid.toString()}
                className="text-fitness-text hover:bg-[#15e7fb] hover:text-[#333333]"
              >
                {position.positionname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          type="button"
          onClick={handleAddPosition}
          disabled={!currentPosition}
          className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {selectedPositions.map((position) => (
          <div 
            key={position.positionid}
            className="flex items-center justify-between p-2 bg-fitness-inner rounded-md"
          >
            <span className="text-fitness-text">{position.positionname}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemovePosition(position.positionid)}
              className="text-red-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};