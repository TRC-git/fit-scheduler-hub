
const ensureUserIntegrationsTable = async (supabase) => {
  try {
    console.log("Ensuring user_integrations table exists");
    
    // Check if table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .rpc('check_and_create_user_integrations_table');
    
    if (tableCheckError) {
      console.error("Error checking/creating user_integrations table:", tableCheckError);
      
      // If the RPC function doesn't exist, try creating the table directly
      console.log("Attempting to create table directly");
      
      const { error: createTableError } = await supabase.query(`
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
          CONSTRAINT user_integrations_user_id_integration_type_key UNIQUE (user_id, integration_type)
        );
        
        -- Add RLS
        ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;
        
        -- Create policies if they don't exist
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'user_integrations' AND policyname = 'Users can view their own integrations'
          ) THEN
            CREATE POLICY "Users can view their own integrations" 
              ON user_integrations FOR SELECT 
              USING (auth.uid() = user_id);
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'user_integrations' AND policyname = 'Users can insert their own integrations'
          ) THEN
            CREATE POLICY "Users can insert their own integrations" 
              ON user_integrations FOR INSERT 
              WITH CHECK (auth.uid() = user_id);
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'user_integrations' AND policyname = 'Users can update their own integrations'
          ) THEN  
            CREATE POLICY "Users can update their own integrations" 
              ON user_integrations FOR UPDATE 
              USING (auth.uid() = user_id);
          END IF;
          
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'user_integrations' AND policyname = 'Users can delete their own integrations'
          ) THEN
            CREATE POLICY "Users can delete their own integrations" 
              ON user_integrations FOR DELETE 
              USING (auth.uid() = user_id);
          END IF;
        END
        $$;
      `);
      
      if (createTableError) {
        console.error("Error creating user_integrations table directly:", createTableError);
        return false;
      }
      
      console.log("Successfully created user_integrations table directly");
    } else {
      console.log("User_integrations table check/creation successful via RPC");
    }
    
    return true;
  } catch (err) {
    console.error("Unexpected error in ensureUserIntegrationsTable:", err);
    return false;
  }
};

module.exports = { ensureUserIntegrationsTable };
