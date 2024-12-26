import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeSlotSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const TimeSlotSelector = ({ value, onChange, label }: TimeSlotSelectorProps) => {
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[100px] bg-fitness-card">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="bg-fitness-card border-fitness-muted">
        {timeSlots.map((time) => (
          <SelectItem
            key={time}
            value={time}
            className="text-fitness-text hover:bg-[#15e7fb] hover:text-[#333333]"
          >
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};