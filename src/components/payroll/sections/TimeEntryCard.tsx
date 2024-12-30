import { format } from "date-fns";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeEntryCardProps {
  entry: any;
  runningTime: number;
  onClockOut: (timeentryId: number) => void;
}

export const TimeEntryCard = ({ entry, runningTime, onClockOut }: TimeEntryCardProps) => {
  const formatRunningTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-[#202020]">
      <div className="space-y-1">
        <p className="text-fitness-text font-medium">
          {entry.employees.firstname} {entry.employees.lastname}
        </p>
        <p className="text-sm text-gray-400">
          {entry.positions?.positionname}
        </p>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-fitness-accent">
            In: {format(new Date(entry.clockintime), 'hh:mm a')}
          </span>
          <span className="flex items-center gap-1 text-fitness-accent">
            <Timer className="w-4 h-4" />
            {formatRunningTime(runningTime)}
          </span>
        </div>
      </div>
      <Button
        variant="destructive"
        onClick={() => onClockOut(entry.timeentryid)}
      >
        Clock Out
      </Button>
    </div>
  );
};