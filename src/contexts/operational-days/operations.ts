
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const checkAdminStatus = async () => {
  try {
    const { data, error } = await supabase.rpc('is_admin');
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    return data;
  } catch (error) {
    console.error('Error in checkAdminStatus:', error);
    return false;
  }
};

const createDefaultLocation = async () => {
  try {
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
      console.info('User is not admin, skipping default location creation');
      return false;
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
    
    return true;
  } catch (error) {
    console.error('Error in createDefaultLocation:', error);
    return false;
  }
};

export const loadOperationalDays = async () => {
  try {
    const defaultCreated = await createDefaultLocation();
    
    // If the user isn't admin and couldn't create a default location,
    // return default operational days instead of trying to fetch
    if (!defaultCreated) {
      return new Set(['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']);
    }

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
    // Return default days when an error occurs
    return new Set(['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']);
  }
};

export const saveOperationalDays = async (operationalDays: Set<string>) => {
  try {
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need administrator rights to modify operational days.",
        variant: "destructive"
      });
      throw new Error('Administrator rights required');
    }

    const { data: location, error: fetchError } = await supabase
      .from('businesslocations')
      .select('locationid')
      .limit(1)
      .single();

    if (fetchError) {
      console.error('Error fetching location:', fetchError);
      toast({
        title: "Error",
        description: "Could not find business location.",
        variant: "destructive"
      });
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
        description: "Failed to save operational days. Please ensure you have administrator rights.",
        variant: "destructive"
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Operational days have been updated successfully.",
    });
    
    return true;
  } catch (error) {
    console.error('Error in saveOperationalDays:', error);
    return false;
  }
};
