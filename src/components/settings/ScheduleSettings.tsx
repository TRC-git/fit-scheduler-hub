import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DaysOfOperation from "./schedule/DaysOfOperation";
import OperatingHours from "./schedule/OperatingHours";
import ClassTypes from "./schedule/class-types/ClassTypes";
import TemplateList from "./schedule/TemplateList";

const ScheduleSettings = () => {
  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Schedule Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DaysOfOperation />
        <OperatingHours />
        <ClassTypes />
        
        <div>
          <TemplateList templates={[]} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleSettings;