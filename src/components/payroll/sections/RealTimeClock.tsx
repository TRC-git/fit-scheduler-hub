
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";

export const RealTimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center gap-2 text-fitness-accent">
      <Clock className="h-5 w-5" />
      <span className="font-mono text-xl">
        {format(currentTime, "hh:mm:ss a")}
      </span>
    </div>
  );
};
