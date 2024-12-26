import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimeSlotSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const TimeSlotSelector = ({ value, onChange, label }: TimeSlotSelectorProps) => {
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      const ampm = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const timeString = `${displayHour.toString().padStart(2, '0')}:00 ${ampm}`;
      const value = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({ display: timeString, value });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px] bg-fitness-card">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="bg-fitness-card border-fitness-muted">
        <ScrollArea className="h-[200px]">
          {timeSlots.map(({ display, value }) => (
            <SelectItem
              key={value}
              value={value}
              className="text-fitness-text hover:bg-[#15e7fb] hover:text-[#333333]"
            >
              {display}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};