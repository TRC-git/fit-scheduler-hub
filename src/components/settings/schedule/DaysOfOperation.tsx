import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useOperationalDays } from '@/contexts/operational-days/useOperationalDays';
import { useToast } from "@/hooks/use-toast";

const DaysOfOperation = () => {
  const daysOfWeek = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
  const { operationalDays, toggleDay, saveOperationalDays, isLoading } = useOperationalDays();
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await saveOperationalDays();
    } catch (error) {
      console.error('Error saving operational days:', error);
      toast({
        title: "Error",
        description: "Failed to update scheduling availability",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3 className="text-fitness-text mb-2">Schedule Days</h3>
      <p className="text-sm text-fitness-text/70 mb-4">
        Select which days appointments can be scheduled. Unselected days will be marked as unavailable in the schedule.
      </p>
      <div className="flex gap-4 flex-wrap mb-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="flex items-center gap-2">
            <Checkbox 
              id={day}
              checked={operationalDays.has(day)}
              onCheckedChange={() => toggleDay(day)}
              className="border-[#15e7fb] data-[state=checked]:bg-[#15e7fb]"
            />
            <Label htmlFor={day} className="text-fitness-text">{day}</Label>
          </div>
        ))}
      </div>
      <Button 
        onClick={handleSave}
        className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
      >
        Save Changes
      </Button>
    </div>
  );
};

export default DaysOfOperation;