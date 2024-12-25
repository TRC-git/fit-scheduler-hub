import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const OperatingHours = () => {
  const [openingTime, setOpeningTime] = useState("09:00");
  const [closingTime, setClosingTime] = useState("17:00");
  const { toast } = useToast();

  useEffect(() => {
    loadOperatingHours();
  }, []);

  const loadOperatingHours = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_types')
        .select('opening_time, closing_time')
        .eq('name', 'default')
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setOpeningTime(data[0].opening_time || "09:00");
        setClosingTime(data[0].closing_time || "17:00");
      }
    } catch (error) {
      console.error('Error loading operating hours:', error);
      toast({
        title: "Error",
        description: "Failed to load operating hours",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('schedule_types')
        .update({ 
          opening_time: openingTime,
          closing_time: closingTime
        })
        .eq('name', 'default');

      if (error) throw error;

      toast({
        title: "Success",
        description: "Operating hours have been updated",
      });
    } catch (error) {
      console.error('Error saving operating hours:', error);
      toast({
        title: "Error",
        description: "Failed to save operating hours",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h3 className="text-fitness-text mb-4">Operating Hours</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label className="text-fitness-text">Opening Time</Label>
          <Input 
            type="time" 
            value={openingTime}
            onChange={(e) => setOpeningTime(e.target.value)}
            className="bg-fitness-inner text-fitness-text" 
          />
        </div>
        <div>
          <Label className="text-fitness-text">Closing Time</Label>
          <Input 
            type="time" 
            value={closingTime}
            onChange={(e) => setClosingTime(e.target.value)}
            className="bg-fitness-inner text-fitness-text" 
          />
        </div>
      </div>
      <Button 
        onClick={handleSave}
        className="bg-[#15e7fb] hover:bg-[#15e7fb]/80 text-[#1A1F2C]"
      >
        Save Operating Hours
      </Button>
    </div>
  );
};

export default OperatingHours;
