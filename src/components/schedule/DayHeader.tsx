import { useOperationalDays } from "@/contexts/OperationalDaysContext";

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
        !isOperational || index === 6 ? "bg-red-900/20" : "bg-fitness-muted"
      } rounded-md`}
    >
      {day}
    </div>
  );
};