import { PositionSelect } from "../../positions/PositionSelect";
import { PositionWithPayRate } from "../../positions/types";

interface StaffPositionsProps {
  selectedPositions: PositionWithPayRate[];
  onPositionsChange: (positions: PositionWithPayRate[]) => void;
}

export const StaffPositions = ({ selectedPositions, onPositionsChange }: StaffPositionsProps) => {
  return (
    <div className="space-y-4">
      <PositionSelect
        selectedPositions={selectedPositions}
        onPositionsChange={onPositionsChange}
      />
    </div>
  );
};