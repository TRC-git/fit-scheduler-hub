import { supabase } from '@/integrations/supabase/client';

export const loadOperationalDays = async () => {
  const { data: settings, error } = await supabase
    .from('class_types')
    .select('operational_days')
    .eq('name', 'default')
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      const defaultDays = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
      const { error: insertError } = await supabase
        .from('class_types')
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
};

export const saveOperationalDays = async (operationalDays: Set<string>) => {
  const { error } = await supabase
    .from('class_types')
    .update({ 
      operational_days: Array.from(operationalDays) 
    })
    .eq('name', 'default');

  if (error) throw error;
};