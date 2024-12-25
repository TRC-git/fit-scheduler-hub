import { supabase } from "@/integrations/supabase/client";

export const loadOperationalDays = async () => {
  try {
    const { data: settings, error } = await supabase
      .from('schedule_types')
      .select('operational_days')
      .eq('name', 'default')
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
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

    return new Set(settings.operational_days || []);
  } catch (error) {
    console.error('Error loading operational days:', error);
    throw error;
  }
};

export const saveOperationalDays = async (days: Set<string>) => {
  try {
    const { error } = await supabase
      .from('schedule_types')
      .update({ 
        operational_days: Array.from(days) 
      })
      .eq('name', 'default');

    if (error) throw error;
  } catch (error) {
    console.error('Error saving operational days:', error);
    throw error;
  }
};