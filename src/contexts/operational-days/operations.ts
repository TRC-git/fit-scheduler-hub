import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const createDefaultLocation = async () => {
  const { data: existingLocation, error: fetchError } = await supabase
    .from('businesslocations')
    .select('locationid')
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    console.error('Error checking for existing location:', fetchError);
    throw fetchError;
  }

  // If no location exists, create a default one
  if (!existingLocation) {
    const { error: insertError } = await supabase
      .from('businesslocations')
      .insert({
        locationname: 'Main Location',
        address: 'Default Address',
        operational_days: ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
      });

    if (insertError) {
      console.error('Error creating default location:', insertError);
      toast({
        title: "Error",
        description: "Failed to create default business location. Please ensure you have admin rights.",
        variant: "destructive"
      });
      throw insertError;
    }
  }
};

export const loadOperationalDays = async () => {
  try {
    await createDefaultLocation();

    const { data: location, error } = await supabase
      .from('businesslocations')
      .select('operational_days')
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return new Set(location?.operational_days || ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']);
  } catch (error) {
    console.error('Error in loadOperationalDays:', error);
    throw error;
  }
};

export const saveOperationalDays = async (operationalDays: Set<string>) => {
  try {
    const { data: location, error: fetchError } = await supabase
      .from('businesslocations')
      .select('locationid')
      .limit(1)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!location) throw new Error('No business location found');

    const { error } = await supabase
      .from('businesslocations')
      .update({ 
        operational_days: Array.from(operationalDays) 
      })
      .eq('locationid', location.locationid);

    if (error) {
      console.error('Error saving operational days:', error);
      toast({
        title: "Error",
        description: "Failed to save operational days. Please ensure you have admin rights.",
        variant: "destructive"
      });
      throw error;
    }
  } catch (error) {
    console.error('Error in saveOperationalDays:', error);
    throw error;
  }
};