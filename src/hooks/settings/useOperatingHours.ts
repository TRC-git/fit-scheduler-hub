import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BusinessLocation } from "@/types/database/business-location";

export const useOperatingHours = () => {
  const [openingTime, setOpeningTime] = useState("09:00");
  const [closingTime, setClosingTime] = useState("17:00");
  const [slotDuration, setSlotDuration] = useState(60);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadOperatingHours();
  }, []);

  const loadOperatingHours = async () => {
    try {
      const { data, error } = await supabase
        .from('businesslocations')
        .select('opening_time, closing_time, slot_duration')
        .maybeSingle();

      if (error) {
        console.error('Error loading operating hours:', error);
        toast({
          title: "Error",
          description: "Failed to load operating hours",
          variant: "destructive",
        });
        return;
      }
      
      if (data) {
        const location = data as BusinessLocation;
        setOpeningTime(location.opening_time?.slice(0, 5) || "09:00");
        setClosingTime(location.closing_time?.slice(0, 5) || "17:00");
        setSlotDuration(location.slot_duration || 60);
      }
    } catch (error) {
      console.error('Error in loadOperatingHours:', error);
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
      
      const { data: existingData, error: checkError } = await supabase
        .from('businesslocations')
        .select('locationid')
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let updateError;
      if (existingData) {
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

  return {
    openingTime,
    setOpeningTime,
    closingTime,
    setClosingTime,
    slotDuration,
    setSlotDuration,
    loading,
    handleSave
  };
};