import { Button } from "@/components/ui/button";
import { TimeInput } from "./operating-hours/TimeInput";
import { DurationInput } from "./operating-hours/DurationInput";
import { useOperatingHours } from "@/hooks/settings/useOperatingHours";

const OperatingHours = () => {
  const {
    openingTime,
    setOpeningTime,
    closingTime,
    setClosingTime,
    slotDuration,
    setSlotDuration,
    loading,
    handleSave
  } = useOperatingHours();

  return (
    <div>
      <h3 className="text-fitness-text mb-4">Operating Hours</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <TimeInput 
          label="Opening Time"
          value={openingTime}
          onChange={setOpeningTime}
        />
        <TimeInput 
          label="Closing Time"
          value={closingTime}
          onChange={setClosingTime}
        />
        <DurationInput 
          value={slotDuration}
          onChange={setSlotDuration}
        />
      </div>
      <Button 
        onClick={handleSave}
        disabled={loading}
        className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
      >
        {loading ? "Saving..." : "Save Operating Hours"}
      </Button>
    </div>
  );
};

export default OperatingHours;