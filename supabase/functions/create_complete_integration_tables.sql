-- Complete database setup for integrations system
-- This script creates all necessary tables and functions

-- 1. Create the main user_integrations table if it doesn't exist
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

-- 2. Create tables for syncing GoHighLevel data
CREATE TABLE IF NOT EXISTS public.ghl_synced_users (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL, -- reference to our authenticated user who initiated the sync
  ghl_user_id TEXT NOT NULL, -- GoHighLevel user ID
  ghl_location_id TEXT NOT NULL, -- GoHighLevel location ID
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role TEXT,
  permissions JSONB, -- Store user permissions/scopes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  synced_at TIMESTAMPTZ DEFAULT now(),
  
  -- Add unique constraint
  UNIQUE(user_id, ghl_user_id, ghl_location_id)
);

CREATE TABLE IF NOT EXISTS public.ghl_synced_calendars (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL, -- reference to our authenticated user who initiated the sync
  ghl_calendar_id TEXT NOT NULL, -- GoHighLevel calendar ID
  ghl_location_id TEXT NOT NULL, -- GoHighLevel location ID
  calendar_name TEXT NOT NULL,
  calendar_type TEXT, -- round_robin, collective, class, service, etc.
  description TEXT,
  timezone TEXT,
  is_active BOOLEAN DEFAULT true,
  team_members JSONB, -- Store team member data
  settings JSONB, -- Store calendar settings like availability, buffer times, etc.
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  synced_at TIMESTAMPTZ DEFAULT now(),
  
  -- Add unique constraint
  UNIQUE(user_id, ghl_calendar_id, ghl_location_id)
);

CREATE TABLE IF NOT EXISTS public.ghl_user_availability (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL, -- reference to our authenticated user who initiated the sync
  ghl_user_id TEXT NOT NULL, -- GoHighLevel user ID
  ghl_calendar_id TEXT NOT NULL, -- GoHighLevel calendar ID
  ghl_location_id TEXT NOT NULL, -- GoHighLevel location ID
  day_of_week INTEGER NOT NULL, -- 0-6 (Sunday-Saturday)
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  synced_at TIMESTAMPTZ DEFAULT now(),
  
  -- Add unique constraint for a user's availability on a specific day for a specific calendar
  UNIQUE(user_id, ghl_user_id, ghl_calendar_id, ghl_location_id, day_of_week, start_time, end_time)
);

-- 3. Add RLS (Row Level Security) for all tables
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghl_synced_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghl_synced_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghl_user_availability ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for user_integrations
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

-- 5. Create policies for ghl_synced_users
DO $$
BEGIN
  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Users can view their own synced users" ON public.ghl_synced_users;
  DROP POLICY IF EXISTS "Users can insert their own synced users" ON public.ghl_synced_users;
  DROP POLICY IF EXISTS "Users can update their own synced users" ON public.ghl_synced_users;
  DROP POLICY IF EXISTS "Users can delete their own synced users" ON public.ghl_synced_users;
  
  -- Create fresh policies
  CREATE POLICY "Users can view their own synced users" 
    ON public.ghl_synced_users FOR SELECT 
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can insert their own synced users" 
    ON public.ghl_synced_users FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  
  CREATE POLICY "Users can update their own synced users" 
    ON public.ghl_synced_users FOR UPDATE 
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can delete their own synced users" 
    ON public.ghl_synced_users FOR DELETE 
    USING (auth.uid() = user_id);
END $$;

-- 6. Create policies for ghl_synced_calendars
DO $$
BEGIN
  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Users can view their own synced calendars" ON public.ghl_synced_calendars;
  DROP POLICY IF EXISTS "Users can insert their own synced calendars" ON public.ghl_synced_calendars;
  DROP POLICY IF EXISTS "Users can update their own synced calendars" ON public.ghl_synced_calendars;
  DROP POLICY IF EXISTS "Users can delete their own synced calendars" ON public.ghl_synced_calendars;
  
  -- Create fresh policies
  CREATE POLICY "Users can view their own synced calendars" 
    ON public.ghl_synced_calendars FOR SELECT 
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can insert their own synced calendars" 
    ON public.ghl_synced_calendars FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  
  CREATE POLICY "Users can update their own synced calendars" 
    ON public.ghl_synced_calendars FOR UPDATE 
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can delete their own synced calendars" 
    ON public.ghl_synced_calendars FOR DELETE 
    USING (auth.uid() = user_id);
END $$;

-- 7. Create policies for ghl_user_availability
DO $$
BEGIN
  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Users can view their own user availability" ON public.ghl_user_availability;
  DROP POLICY IF EXISTS "Users can insert their own user availability" ON public.ghl_user_availability;
  DROP POLICY IF EXISTS "Users can update their own user availability" ON public.ghl_user_availability;
  DROP POLICY IF EXISTS "Users can delete their own user availability" ON public.ghl_user_availability;
  
  -- Create fresh policies
  CREATE POLICY "Users can view their own user availability" 
    ON public.ghl_user_availability FOR SELECT 
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can insert their own user availability" 
    ON public.ghl_user_availability FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  
  CREATE POLICY "Users can update their own user availability" 
    ON public.ghl_user_availability FOR UPDATE 
    USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can delete their own user availability" 
    ON public.ghl_user_availability FOR DELETE 
    USING (auth.uid() = user_id);
END $$;

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON public.user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_type ON public.user_integrations(integration_type);

CREATE INDEX IF NOT EXISTS idx_ghl_synced_users_user_id ON public.ghl_synced_users(user_id);
CREATE INDEX IF NOT EXISTS idx_ghl_synced_users_ghl_user_id ON public.ghl_synced_users(ghl_user_id);
CREATE INDEX IF NOT EXISTS idx_ghl_synced_users_email ON public.ghl_synced_users(email);

CREATE INDEX IF NOT EXISTS idx_ghl_synced_calendars_user_id ON public.ghl_synced_calendars(user_id);
CREATE INDEX IF NOT EXISTS idx_ghl_synced_calendars_ghl_calendar_id ON public.ghl_synced_calendars(ghl_calendar_id);

CREATE INDEX IF NOT EXISTS idx_ghl_user_availability_user_id ON public.ghl_user_availability(user_id);
CREATE INDEX IF NOT EXISTS idx_ghl_user_availability_ghl_user_id ON public.ghl_user_availability(ghl_user_id);
CREATE INDEX IF NOT EXISTS idx_ghl_user_availability_day_of_week ON public.ghl_user_availability(day_of_week);

-- 9. Create the RPC function that the get-integrations function expects
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

-- Grant execute permissions on the function
GRANT EXECUTE ON FUNCTION public.check_and_create_user_integrations_table() TO anon, authenticated, service_role;

-- 10. Add comments for documentation
COMMENT ON TABLE public.user_integrations IS 'Stores integration connections and credentials for users';
COMMENT ON TABLE public.ghl_synced_users IS 'Stores users synced from GoHighLevel';
COMMENT ON TABLE public.ghl_synced_calendars IS 'Stores calendars synced from GoHighLevel';
COMMENT ON TABLE public.ghl_user_availability IS 'Stores user availability data from GoHighLevel calendars';

-- Verification queries (these will show the created tables)
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%integration%' OR table_name LIKE '%ghl_%';
-- SELECT proname FROM pg_proc WHERE proname = 'check_and_create_user_integrations_table'; 