
const { createClient } = require('@supabase/supabase-js');

/**
 * Ensure the user_integrations table exists in the database
 * @param {Object} supabase - Supabase client
 * @returns {Promise<boolean>} - True if table exists or was created, false otherwise
 */
async function ensureUserIntegrationsTable(supabase) {
  try {
    // Check if the table exists
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_integrations');

    if (tables && tables.length > 0) {
      console.log('user_integrations table exists');
      return true;
    }

    // Create the table if it doesn't exist
    console.log('Creating user_integrations table');
    
    const { error } = await supabase.rpc('check_and_create_user_integrations_table');
    
    if (error) {
      console.error('Error creating user_integrations table with RPC:', error);
      
      // Try direct SQL if RPC fails
      const { error: sqlError } = await supabase
        .rpc('execute_sql', {
          sql_query: `
            CREATE TABLE IF NOT EXISTS public.user_integrations (
              id SERIAL PRIMARY KEY,
              user_id UUID NOT NULL,
              integration_type TEXT NOT NULL,
              status TEXT NOT NULL,
              connection_method TEXT NOT NULL,
              created_at TIMESTAMPTZ DEFAULT now(),
              updated_at TIMESTAMPTZ DEFAULT now(),
              last_synced_at TIMESTAMPTZ,
              credentials JSONB,
              location_id TEXT,
              synced_data JSONB
            );
          `
        });
      
      if (sqlError) {
        console.error('Error creating user_integrations table with SQL:', sqlError);
        return false;
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error in ensureUserIntegrationsTable:', err);
    return false;
  }
}

module.exports = { ensureUserIntegrationsTable };
