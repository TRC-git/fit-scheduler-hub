import { ChevronLeft, ChevronRight } from "lucide-react";
import { useClassTypes } from "@/hooks/schedule/useClassTypes";

const ScheduleHeader = () => {
  const { classTypes, isLoading } = useClassTypes();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <select className="bg-fitness-card text-fitness-text border border-fitness-muted rounded-md px-4 py-2 w-[210px]">
          {isLoading ? (
            <option className="pl-2">Loading...</option>
          ) : (
            <>
              {classTypes?.map((type) => (
                <option key={type.class_type_id} value={type.name} className="pl-2">
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
          <ChevronLeft className="w-5 h-5 text-fitness-text cursor-pointer" />
          <span className="text-fitness-text">Week of May 29th 2023</span>
          <ChevronRight className="w-5 h-5 text-fitness-text cursor-pointer" />
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