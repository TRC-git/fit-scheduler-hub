import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

const ScheduleSettings = () => {
  const daysOfWeek = [
    "Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"
  ];

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Schedule Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-fitness-text mb-4">Days of Operation</h3>
          <div className="flex gap-4">
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

        <div>
          <h3 className="text-fitness-text mb-4">Operating Hours</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-fitness-text">Opening Time</Label>
              <Input type="time" className="bg-fitness-inner text-fitness-text" />
            </div>
            <div>
              <Label className="text-fitness-text">Closing Time</Label>
              <Input type="time" className="bg-fitness-inner text-fitness-text" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-fitness-text mb-4">Schedule Templates</h3>
          <Button className="bg-[#15e7fb] hover:bg-[#15e7fb]/80">
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleSettings;