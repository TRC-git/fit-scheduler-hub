const { URLSearchParams } = require('url');
const { verifySupabaseJwt } = require('./verifySupabaseJwt');

exports.handler = async (event, context) => {
  // Authenticate user using Supabase JWT
  const userId = verifySupabaseJwt(event.headers.authorization);
  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  // GoHighLevel OAuth details from environment variables
  const clientId = process.env.GHL_CLIENT_ID;
  const redirectUri = process.env.GHL_REDIRECT_URI; // Must match the one set in GoHighLevel app

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

  return {
    statusCode: 200,
    body: JSON.stringify({ url: authUrl }),
  };
}; 