interface DayHeaderProps {
  day: string;
  index: number;
}

export const DayHeader = ({ day, index }: DayHeaderProps) => (
  <div
    className={`text-fitness-text font-medium p-2 text-center ${
      index === 6 ? "bg-red-900/20" : "bg-fitness-muted"
    } rounded-md`}
  >
    {day}
  </div>
);