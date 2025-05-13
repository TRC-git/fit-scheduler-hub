
CREATE OR REPLACE FUNCTION public.check_and_create_user_integrations_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the user_integrations table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'user_integrations'
  ) THEN
    -- Create user_integrations table
    CREATE TABLE user_integrations (
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
    
    -- Add constraint for user_id and integration_type
    ALTER TABLE user_integrations 
      ADD CONSTRAINT user_integrations_user_id_integration_type_key 
      UNIQUE (user_id, integration_type);
    
    -- Add RLS
    ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Users can view their own integrations" 
      ON user_integrations FOR SELECT 
      USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert their own integrations" 
      ON user_integrations FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Users can update their own integrations" 
      ON user_integrations FOR UPDATE 
      USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can delete their own integrations" 
      ON user_integrations FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END;
$$;
