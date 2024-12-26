import { Card } from "@/components/ui/card";

export const StaffLoadingState = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="p-4 bg-fitness-card animate-pulse h-32" />
      ))}
    </div>
  );
};