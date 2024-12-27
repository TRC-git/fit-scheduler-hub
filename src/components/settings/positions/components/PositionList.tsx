import { PositionCard } from "../PositionCard";

interface PositionListProps {
  positions: any[];
  onEdit: (position: any) => void;
  onDelete: (positionId: number) => void;
}

export const PositionList = ({ positions, onEdit, onDelete }: PositionListProps) => {
  return (
    <div className="grid gap-4">
      {positions?.map((position: any) => (
        <PositionCard
          key={position.positionid}
          position={position}
          onEdit={() => onEdit(position)}
          onDelete={() => onDelete(position.positionid)}
        />
      ))}
    </div>
  );
};