import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OperationalDaysProps {
  selectedDays: string[];
  onDayToggle: (day: string) => void;
}

const OperationalDays = ({ selectedDays, onDayToggle }: OperationalDaysProps) => {
  const daysOfWeek = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
  const { toast } = useToast();

  const handleDayToggle = async (day: string) => {
    try {
      onDayToggle(day);
    } catch (error) {
      console.error('Error toggling day:', error);
      toast({
        title: "Error",
        description: "Failed to update operational day",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Label className="text-fitness-text mb-2 block">Schedule Days</Label>
      <div className="flex flex-wrap gap-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex items-center gap-2">
            <Checkbox
              id={day}
              checked={selectedDays.includes(day)}
              onCheckedChange={() => handleDayToggle(day)}
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