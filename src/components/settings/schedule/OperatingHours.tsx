import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const OperatingHours = () => {
  const [openingTime, setOpeningTime] = useState("09:00");
  const [closingTime, setClosingTime] = useState("17:00");
  const [slotDuration, setSlotDuration] = useState(60);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOperatingHours();
  }, []);

  const loadOperatingHours = async () => {
    try {
      const { data, error } = await supabase
        .from('businesslocations')
        .select('opening_time, closing_time, slot_duration')
        .single();

      if (error) throw error;
      
      if (data) {
        setOpeningTime(data.opening_time || "09:00");
        setClosingTime(data.closing_time || "17:00");
        setSlotDuration(data.slot_duration || 60);
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
      setLoading(true);
      
      // First check if default record exists
      const { data: existingData, error: checkError } = await supabase
        .from('businesslocations')
        .select('locationid')
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw checkError;
      }

      let updateError;
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('businesslocations')
          .update({ 
            opening_time: openingTime,
            closing_time: closingTime,
            slot_duration: slotDuration
          })
          .eq('locationid', existingData.locationid);
        updateError = error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('businesslocations')
          .insert([{ 
            locationname: 'Default Location',
            address: 'Default Address',
            opening_time: openingTime,
            closing_time: closingTime,
            slot_duration: slotDuration
          }]);
        updateError = error;
      }

      if (updateError) throw updateError;

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-fitness-text mb-4">Operating Hours</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
        <div>
          <Label className="text-fitness-text">Slot Duration (minutes)</Label>
          <Input 
            type="number" 
            value={slotDuration}
            onChange={(e) => setSlotDuration(parseInt(e.target.value))}
            min={15}
            max={120}
            step={15}
            className="bg-fitness-inner text-fitness-text" 
          />
        </div>
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