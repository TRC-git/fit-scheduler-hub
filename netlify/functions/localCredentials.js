
// TEMPORARY FILE - REMOVE BEFORE PRODUCTION
// This file contains development credentials and will be replaced by environment variables in production

module.exports = {
  // Supabase credentials
  SUPABASE_URL: "https://yuctdxtvgicirworkish.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "your-service-role-key-here",
  SUPABASE_JWT_SECRET: "your-jwt-secret-here",
  
  // GoHighLevel OAuth credentials
  GHL_CLIENT_ID: "your-client-id-here",
  GHL_CLIENT_SECRET: "your-client-secret-here", 
  GHL_REDIRECT_URI: "http://localhost:8888/.netlify/functions/oauth-callback",
  OAUTH_SUCCESS_REDIRECT: "http://localhost:5173/settings?tab=integrations&success=1"
};
