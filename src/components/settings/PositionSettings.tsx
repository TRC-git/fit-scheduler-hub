import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

const PositionSettings = () => {
  const { toast } = useToast();
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: positions, refetch } = useQuery({
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
      refetch();
      setIsDialogOpen(false);
    },
  });

  const updatePositionMutation = useMutation({
    mutationFn: async (positionData: any) => {
      const { data, error } = await supabase
        .from('positions')
        .update(positionData)
        .eq('positionid', selectedPosition.positionid);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position updated successfully",
      });
      refetch();
      setIsDialogOpen(false);
      setSelectedPosition(null);
    },
  });

  const deletePositionMutation = useMutation({
    mutationFn: async (positionId: number) => {
      const { error } = await supabase
        .from('positions')
        .delete()
        .eq('positionid', positionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Position deleted successfully",
      });
      refetch();
    },
  });

  const handleEdit = (position: any) => {
    setSelectedPosition(position);
    setIsDialogOpen(true);
  };

  const handleDelete = (positionId: number) => {
    deletePositionMutation.mutate(positionId);
  };

  const handleSubmit = (positionData: any) => {
    if (selectedPosition) {
      updatePositionMutation.mutate(positionData);
    } else {
      createPositionMutation.mutate(positionData);
    }
  };

  return (
    <Card className="bg-fitness-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-fitness-text">Positions & Wages</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
              onClick={() => setSelectedPosition(null)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Position
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-fitness-card">
            <DialogHeader>
              <DialogTitle className="text-fitness-text">
                {selectedPosition ? 'Edit Position' : 'Add New Position'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label className="text-fitness-text">Position Name</Label>
                <Input 
                  placeholder="Enter position name" 
                  className="bg-fitness-inner text-fitness-text"
                  defaultValue={selectedPosition?.positionname || ''}
                />
              </div>
              
              <div>
                <Label className="text-fitness-text">Pay Type</Label>
                <Select defaultValue={selectedPosition?.paytype || ''}>
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
                  defaultValue={selectedPosition?.defaultpayrate || ''}
                />
              </div>

              <div>
                <Label className="text-fitness-text">Required Certifications</Label>
                <Input 
                  placeholder="Enter certifications (comma-separated)" 
                  className="bg-fitness-inner text-fitness-text"
                  defaultValue={selectedPosition?.required_certifications?.join(', ') || ''}
                />
              </div>

              <div>
                <Label className="text-fitness-text">Minimum Experience (months)</Label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="bg-fitness-inner text-fitness-text"
                  defaultValue={selectedPosition?.min_experience_months || ''}
                />
              </div>

              <Button 
                className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
                onClick={() => handleSubmit({
                  positionname: "New Position",
                  defaultpayrate: 15,
                  paytype: "hourly"
                })}
              >
                {selectedPosition ? 'Update Position' : 'Add Position'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {positions?.map((position: any) => (
            <div key={position.positionid} className="p-4 bg-fitness-inner rounded-md flex justify-between items-center">
              <div>
                <h4 className="text-fitness-text font-medium">{position.positionname}</h4>
                <p className="text-fitness-text/70 text-sm mt-1">
                  Default Rate: ${position.defaultpayrate}/hr
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(position)}
                  className="h-8 w-8 hover:bg-fitness-card/10"
                >
                  <Pencil className="h-4 w-4 text-fitness-text" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(position.positionid)}
                  className="h-8 w-8 hover:bg-fitness-card/10"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PositionSettings;