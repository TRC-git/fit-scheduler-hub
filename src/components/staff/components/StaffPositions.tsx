interface Position {
  positions: {
    positionname: string;
  };
  is_primary: boolean;
  payrate: number;
}

interface StaffPositionsProps {
  positions: Position[];
  onPayRateEdit: (position: Position) => void;
}

export const StaffPositions = ({ positions, onPayRateEdit }: StaffPositionsProps) => {
  return (
    <div className="mt-2 space-y-1">
      {positions?.map((position: Position, index: number) => (
        <div key={index} className="flex items-center justify-between text-xs">
          <span className="text-fitness-accent">
            {position.positions.positionname}
            {position.is_primary && " (Primary)"}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-fitness-text">
              ${position.payrate}/hr
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-[#15e7fb]"
              onClick={() => onPayRateEdit(position)}
            >
              <DollarSign className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};