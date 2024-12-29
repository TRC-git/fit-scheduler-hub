import { ChevronLeft, ChevronRight } from "lucide-react";
import { useClassTypes } from "@/hooks/schedule/useClassTypes";
import { useState } from "react";
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from "date-fns";

const ScheduleHeader = () => {
  const { classTypes, isLoading } = useClassTypes();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const handlePreviousWeek = () => {
    setCurrentWeek(prevWeek => subWeeks(prevWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prevWeek => addWeeks(prevWeek, 1));
  };

  // Get the start (Monday) and end (Sunday) of the week
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 1 represents Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  const weekDisplay = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <select className="bg-fitness-card text-fitness-text border border-fitness-muted rounded-md px-4 py-2 w-[210px]">
          {isLoading ? (
            <option className="pl-2">Loading...</option>
          ) : (
            <>
              <option value="all" className="pl-2">All Schedules</option>
              {classTypes?.map((type) => (
                <option key={type.schedule_type_id} value={type.name} className="pl-2">
                  {type.name}
                </option>
              ))}
            </>
          )}
        </select>
        <button className="px-4 py-2 bg-fitness-muted text-fitness-text rounded-md w-[140px]">
          Post Schedule
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-fitness-card px-4 py-2 rounded-md">
          <ChevronLeft 
            className="w-5 h-5 text-fitness-text cursor-pointer hover:text-fitness-accent transition-colors" 
            onClick={handlePreviousWeek}
          />
          <span className="text-fitness-text min-w-[200px] text-center">{weekDisplay}</span>
          <ChevronRight 
            className="w-5 h-5 text-fitness-text cursor-pointer hover:text-fitness-accent transition-colors" 
            onClick={handleNextWeek}
          />
        </div>
        <button className="px-4 py-2 bg-fitness-muted text-fitness-text rounded-md">
          Clone Week
        </button>
      </div>
      
      <button className="px-4 py-2 bg-fitness-accent text-white rounded-md">
        Clock-In
      </button>
    </div>
  );
};

export default ScheduleHeader;