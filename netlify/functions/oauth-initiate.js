
const { URLSearchParams } = require('url');
const { verifySupabaseJwt } = require('./verifySupabaseJwt');
const localCredentials = require('./localCredentials');

// Add CORS headers for local development
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  // Add CORS headers to all responses
  const headers = { ...corsHeaders };

  try {
    // Authenticate user using Supabase JWT
    const userId = verifySupabaseJwt(event.headers.authorization);
    if (!userId) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    // Get the host for dynamic redirect URLs
    const host = event.headers.host || 'localhost:8888';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // GoHighLevel OAuth details from environment variables or local credentials
    const clientId = process.env.GHL_CLIENT_ID || localCredentials.GHL_CLIENT_ID;
    // Use dynamic redirect URI based on the host
    const redirectUri = process.env.GHL_REDIRECT_URI || 
                        `${baseUrl}/.netlify/functions/oauth-callback`;

    // Scopes required for your integration (adjust as needed)
    const scopes = [
      'contacts.read',
      // add more scopes as needed
    ].join(' ');

    // State parameter for CSRF protection (optional but recommended)
    // You may want to store this in a session or DB for later verification
    const state = `${userId}-${Date.now()}`;

    // Construct the authorization URL
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes,
      state,
    });

    const authUrl = `https://marketplace.gohighlevel.com/oauth/chooselocation?${params.toString()}`;
    console.log("Generated OAuth URL:", authUrl);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: authUrl }),
    };
  } catch (err) {
    console.error("Error in oauth-initiate function:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: err.message }),
    };
  }
};
