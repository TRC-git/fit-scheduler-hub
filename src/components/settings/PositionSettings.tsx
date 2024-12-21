import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PositionSettings = () => {
  const { toast } = useToast();

  const { data: positions } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('positions')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const createPositionMutation = useMutation({
    mutationFn: async (positionData: any) => {
      const { data, error } = await supabase
        .from('positions')
        .insert([positionData]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position created successfully",
      });
    },
  });

  return (
    <Card className="bg-fitness-card">
      <CardHeader>
        <CardTitle className="text-fitness-text">Positions & Wages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {positions?.map((position: any) => (
            <div key={position.positionid} className="p-4 bg-fitness-inner rounded-md">
              <h4 className="text-fitness-text font-medium">{position.positionname}</h4>
              <p className="text-fitness-text/70 text-sm mt-1">
                Default Rate: ${position.defaultpayrate}/hr
              </p>
            </div>
          ))}

          <div className="grid gap-4 p-4 border border-dashed border-fitness-muted rounded-md">
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

            <div>
              <Label className="text-fitness-text">Required Certifications</Label>
              <Input 
                placeholder="Enter certifications (comma-separated)" 
                className="bg-fitness-inner text-fitness-text"
              />
            </div>

            <div>
              <Label className="text-fitness-text">Minimum Experience (months)</Label>
              <Input 
                type="number" 
                placeholder="0" 
                className="bg-fitness-inner text-fitness-text"
              />
            </div>

            <Button 
              className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
              onClick={() => createPositionMutation.mutate({
                positionname: "New Position",
                defaultpayrate: 15,
                paytype: "hourly"
              })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Position
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PositionSettings;