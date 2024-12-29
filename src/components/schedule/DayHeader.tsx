import { useOperationalDays } from '@/contexts/operational-days/useOperationalDays';

interface DayHeaderProps {
  day: string;
  index: number;
}

export const DayHeader = ({ day, index }: DayHeaderProps) => {
  const { operationalDays } = useOperationalDays();
  const isOperational = operationalDays.has(day);

  return (
    <div
      className={`text-fitness-text font-medium p-2 text-center ${
        !isOperational ? "bg-red-900/20" : "bg-fitness-muted"
      } rounded-md`}
    >
      {day}
      {!isOperational && (
        <div className="text-xs text-fitness-text/50 mt-1">Closed</div>
      )}
    </div>
  );
};