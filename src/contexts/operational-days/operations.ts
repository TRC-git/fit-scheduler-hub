import { supabase } from '@/integrations/supabase/client';

export const loadOperationalDays = async () => {
  try {
    const { data: location, error } = await supabase
      .from('businesslocations')
      .select('operational_days')
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    // If no business location exists, create one with default settings
    if (!location) {
      const defaultDays = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
      const { error: insertError } = await supabase
        .from('businesslocations')
        .insert({
          locationname: 'Main Location',
          address: 'Default Address',
          operational_days: defaultDays
        });

      if (insertError) throw insertError;
      return new Set(defaultDays);
    }

    return new Set(location?.operational_days || []);
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

    if (error) throw error;
  } catch (error) {
    console.error('Error in saveOperationalDays:', error);
    throw error;
  }
};