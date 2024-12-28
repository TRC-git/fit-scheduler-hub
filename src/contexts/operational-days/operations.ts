import { supabase } from '@/integrations/supabase/client';

export const loadOperationalDays = async () => {
  try {
    const { data: settings, error } = await supabase
      .from('schedule_types')
      .select('operational_days')
      .eq('name', 'default')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // If no default settings exist, create them
        const defaultDays = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
        const { error: insertError } = await supabase
          .from('schedule_types')
          .insert({
            name: 'default',
            duration: 60,
            operational_days: defaultDays
          });

        if (insertError) throw insertError;
        return new Set(defaultDays);
      }
      throw error;
    }

    return new Set(settings?.operational_days || []);
  } catch (error) {
    console.error('Error in loadOperationalDays:', error);
    throw error;
  }
};

export const saveOperationalDays = async (operationalDays: Set<string>) => {
  try {
    const { error } = await supabase
      .from('schedule_types')
      .update({ 
        operational_days: Array.from(operationalDays)
      })
      .eq('name', 'default');

    if (error) throw error;
  } catch (error) {
    console.error('Error in saveOperationalDays:', error);
    throw error;
  }
};