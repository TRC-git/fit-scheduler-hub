-- Create tables for syncing GoHighLevel data

-- Table to store synced users from GoHighLevel
CREATE TABLE IF NOT EXISTS ghl_synced_users (
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

-- Table to store synced calendars from GoHighLevel
CREATE TABLE IF NOT EXISTS ghl_synced_calendars (
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

-- Table to store user availability from GoHighLevel calendars
CREATE TABLE IF NOT EXISTS ghl_user_availability (
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

-- Add RLS (Row Level Security) for all tables
ALTER TABLE ghl_synced_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ghl_synced_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE ghl_user_availability ENABLE ROW LEVEL SECURITY;

-- Create policies for ghl_synced_users
CREATE POLICY "Users can view their own synced users" 
  ON ghl_synced_users FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own synced users" 
  ON ghl_synced_users FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own synced users" 
  ON ghl_synced_users FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own synced users" 
  ON ghl_synced_users FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for ghl_synced_calendars
CREATE POLICY "Users can view their own synced calendars" 
  ON ghl_synced_calendars FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own synced calendars" 
  ON ghl_synced_calendars FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own synced calendars" 
  ON ghl_synced_calendars FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own synced calendars" 
  ON ghl_synced_calendars FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for ghl_user_availability
CREATE POLICY "Users can view their own user availability" 
  ON ghl_user_availability FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own user availability" 
  ON ghl_user_availability FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own user availability" 
  ON ghl_user_availability FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own user availability" 
  ON ghl_user_availability FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ghl_synced_users_user_id ON ghl_synced_users(user_id);
CREATE INDEX IF NOT EXISTS idx_ghl_synced_users_ghl_user_id ON ghl_synced_users(ghl_user_id);
CREATE INDEX IF NOT EXISTS idx_ghl_synced_users_email ON ghl_synced_users(email);

CREATE INDEX IF NOT EXISTS idx_ghl_synced_calendars_user_id ON ghl_synced_calendars(user_id);
CREATE INDEX IF NOT EXISTS idx_ghl_synced_calendars_ghl_calendar_id ON ghl_synced_calendars(ghl_calendar_id);

CREATE INDEX IF NOT EXISTS idx_ghl_user_availability_user_id ON ghl_user_availability(user_id);
CREATE INDEX IF NOT EXISTS idx_ghl_user_availability_ghl_user_id ON ghl_user_availability(ghl_user_id);
CREATE INDEX IF NOT EXISTS idx_ghl_user_availability_day_of_week ON ghl_user_availability(day_of_week); 