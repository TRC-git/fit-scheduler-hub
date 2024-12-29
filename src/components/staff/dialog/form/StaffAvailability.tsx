import { AvailabilitySection } from "../availability/AvailabilitySection";
import { TimeSlot } from "../types/availability";

interface StaffAvailabilityProps {
  employeeId?: number;
  availability: TimeSlot[];
  onAvailabilityChange: (availability: TimeSlot[]) => void;
}

export const StaffAvailability = ({
  employeeId,
  availability,
  onAvailabilityChange,
}: StaffAvailabilityProps) => {
  return (
    <AvailabilitySection
      employeeId={employeeId}
      initialAvailability={availability}
      onAvailabilityChange={onAvailabilityChange}
    />
  );
};