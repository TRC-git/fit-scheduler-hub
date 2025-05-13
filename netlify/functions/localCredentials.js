
// TEMPORARY FILE - REMOVE BEFORE PRODUCTION
// This file contains development credentials and will be replaced by environment variables in production

module.exports = {
  // Supabase credentials
  SUPABASE_URL: "https://yuctdxtvgicirworkish.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1Y3RkeHR2Z2ljaXJ3b3JraXNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzk0NTU1NywiZXhwIjoyMDQ5NTIxNTU3fQ.VQnsHm5G_gtaRXEBD7zVBCodgZ1l4JBDU-Ew8B-2KU4",
  SUPABASE_JWT_SECRET: "BcPc6fEFerfJh8RDhNZ+uTUIqKUNiXWCIne+/MZAh8oS8KLjrDbWqQLkwgBHbS//cB62ht8po2wOnL4s57rVRA==",
  
  // GoHighLevel OAuth credentials
  GHL_CLIENT_ID: "67f1d47b7105b8f30a3f3a73-m94zhlyv",
  GHL_CLIENT_SECRET: " aec03c89-97e9-41dc-a543-8972c2bf5303", 
  GHL_REDIRECT_URI: "http://localhost:8888/.netlify/functions/oauth-callback",
  OAUTH_SUCCESS_REDIRECT: "http://localhost:5173/settings?tab=integrations&success=1"
};
