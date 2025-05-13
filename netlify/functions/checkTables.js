
const { createClient } = require('@supabase/supabase-js');

/**
 * Ensure the user_integrations table exists in the database
 * @param {Object} supabase - Supabase client
 * @returns {Promise<boolean>} - True if table exists or was created, false otherwise
 */
async function ensureUserIntegrationsTable(supabase) {
  try {
    // Check if the table exists
    const { data: tables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_integrations');

    if (checkError) {
      console.error('Error checking tables:', checkError);
      return false;
    }

    if (tables && tables.length > 0) {
      console.log('user_integrations table exists');
      return true;
    }

    // Create the table if it doesn't exist
    console.log('Creating user_integrations table');
    
    try {
      // Try to call the SQL function
      const { error: rpcError } = await supabase.rpc('check_and_create_user_integrations_table');
      
      if (rpcError) {
        console.error('Error creating user_integrations table with RPC:', rpcError);
        
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
                synced_data JSONB,
                UNIQUE(user_id, integration_type)
              );
              
              -- Enable RLS
              ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;
              
              -- Create policies
              CREATE POLICY "Users can view their own integrations" 
                ON public.user_integrations FOR SELECT 
                USING (auth.uid() = user_id);
              
              CREATE POLICY "Users can insert their own integrations" 
                ON public.user_integrations FOR INSERT 
                WITH CHECK (auth.uid() = user_id);
              
              CREATE POLICY "Users can update their own integrations" 
                ON public.user_integrations FOR UPDATE 
                USING (auth.uid() = user_id);
              
              CREATE POLICY "Users can delete their own integrations" 
                ON public.user_integrations FOR DELETE 
                USING (auth.uid() = user_id);
            `
          });
        
        if (sqlError) {
          console.error('Error creating user_integrations table with SQL:', sqlError);
          return false;
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error creating user_integrations table:', err);
      
      // Last resort - try direct SQL without RPC
      try {
        const { error } = await supabase.from('user_integrations').select('*').limit(1);
        // If we can query the table without error, it exists
        if (!error || error.code !== 'PGRST116') {
          return true;
        }
        return false;
      } catch (finalErr) {
        console.error('Final attempt to check table failed:', finalErr);
        return false;
      }
    }
  } catch (err) {
    console.error('Error in ensureUserIntegrationsTable:', err);
    return false;
  }
}

module.exports = { ensureUserIntegrationsTable };
