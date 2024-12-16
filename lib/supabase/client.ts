import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = "https://yuctdxtvgicirworkish.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1Y3RkeHR2Z2ljaXJ3b3JraXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NDU1NTcsImV4cCI6MjA0OTUyMTU1N30.qgLgZ2RtzHBa0ZDcmHP7oD5YapjaUepT_qESC52GC8o"

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)