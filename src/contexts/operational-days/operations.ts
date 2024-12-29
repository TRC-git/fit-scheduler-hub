import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const checkAdminStatus = async () => {
  const { data, error } = await supabase.rpc('is_admin');
  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
  return data;
};

const createDefaultLocation = async () => {
  try {
    // First check if user is admin
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
      console.log('User is not admin, skipping default location creation');
      return;
    }

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
      console.log('No existing location found, creating default...');
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
  } catch (error) {
    console.error('Error in createDefaultLocation:', error);
    throw error;
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

    if (error) {
      console.error('Error loading operational days:', error);
      throw error;
    }

    return new Set(location?.operational_days || ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']);
  } catch (error) {
    console.error('Error in loadOperationalDays:', error);
    throw error;
  }
};

export const saveOperationalDays = async (operationalDays: Set<string>) => {
  try {
    // Check if user is admin before attempting to save
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
      toast({
        title: "Error",
        description: "You need admin rights to modify operational days.",
        variant: "destructive"
      });
      throw new Error('Admin rights required');
    }

    const { data: location, error: fetchError } = await supabase
      .from('businesslocations')
      .select('locationid')
      .limit(1)
      .single();

    if (fetchError) {
      console.error('Error fetching location:', fetchError);
      throw fetchError;
    }

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