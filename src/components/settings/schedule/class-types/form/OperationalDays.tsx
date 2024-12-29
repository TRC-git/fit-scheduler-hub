import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface OperationalDaysProps {
  selectedDays: string[];
  onDayToggle: (day: string) => void;
}

const OperationalDays = ({ selectedDays, onDayToggle }: OperationalDaysProps) => {
  const daysOfWeek = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];

  return (
    <div>
      <Label className="text-fitness-text mb-2 block">Schedule Days</Label>
      <div className="flex flex-wrap gap-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex items-center gap-2">
            <Checkbox
              id={day}
              checked={selectedDays.includes(day)}
              onCheckedChange={() => onDayToggle(day)}
              className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
            />
            <Label htmlFor={day} className="text-fitness-text">{day}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationalDays;