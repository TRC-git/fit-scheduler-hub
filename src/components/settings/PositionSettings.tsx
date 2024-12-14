import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PositionSettings = () => {
  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Positions & Wages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <Label className="text-fitness-text">Position Name</Label>
            <Input 
              placeholder="Enter position name" 
              className="bg-fitness-inner text-fitness-text"
            />
          </div>
          
          <div>
            <Label className="text-fitness-text">Pay Type</Label>
            <Select>
              <SelectTrigger className="bg-fitness-inner text-fitness-text">
                <SelectValue placeholder="Select pay type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-fitness-text">Default Rate</Label>
            <Input 
              type="number" 
              placeholder="0.00" 
              className="bg-fitness-inner text-fitness-text"
            />
          </div>

          <Button className="bg-[#15e7fb] hover:bg-[#15e7fb]/80">
            <Plus className="w-4 h-4 mr-2" />
            Add Position
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PositionSettings;