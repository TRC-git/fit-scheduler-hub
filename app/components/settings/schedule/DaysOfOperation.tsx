import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const DaysOfOperation = () => {
  const daysOfWeek = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

  return (
    <div>
      <h3 className="text-fitness-text mb-4">Days of Operation</h3>
      <div className="flex gap-4 flex-wrap">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex items-center gap-2">
            <Checkbox 
              id={day}
              className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
            />
            <Label htmlFor={day} className="text-fitness-text">{day}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaysOfOperation;