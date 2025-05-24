-- Minimal script to fix integration database issues
-- Only creates the missing user_integrations table and RPC function

-- 1. Create the main user_integrations table (this is what's missing)
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

-- 2. Add RLS (Row Level Security) for user_integrations table
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for user_integrations
DO $$
BEGIN
  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Users can view their own integrations" ON public.user_integrations;
  DROP POLICY IF EXISTS "Users can insert their own integrations" ON public.user_integrations;
  DROP POLICY IF EXISTS "Users can update their own integrations" ON public.user_integrations;
  DROP POLICY IF EXISTS "Users can delete their own integrations" ON public.user_integrations;
  
  -- Create fresh policies
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
END $$;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON public.user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_type ON public.user_integrations(integration_type);

-- 5. Create the RPC function that the get-integrations function expects
CREATE OR REPLACE FUNCTION public.check_and_create_user_integrations_table()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function always returns true since we handle table creation in this script
  -- The get-integrations function expects this to exist
  RETURN true;
END;
$$;

-- 6. Grant execute permissions on the function
GRANT EXECUTE ON FUNCTION public.check_and_create_user_integrations_table() TO anon, authenticated, service_role;

-- 7. Verification query (uncomment to test)
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_integrations'; 