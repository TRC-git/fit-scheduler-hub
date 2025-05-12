const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
// No need to verifySupabaseJwt here, userId comes from state

exports.handler = async (event, context) => {
  // Parse query params from redirect
  const params = event.queryStringParameters;
  const code = params.code;
  const state = params.state;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing authorization code' }),
    };
  }

  // Extract userId from state (if you encoded it as userId-timestamp)
  const userId = state?.split('-')[0];
  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  // Exchange code for tokens
  const tokenUrl = 'https://services.leadconnectorhq.com/oauth/token';
  const clientId = process.env.GHL_CLIENT_ID;
  const clientSecret = process.env.GHL_CLIENT_SECRET;
  const redirectUri = process.env.GHL_REDIRECT_URI;

  const tokenRes = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Token exchange failed', details: tokenData }),
    };
  }

  // Test API call to GoHighLevel (fetch contact count)
  const testRes = await fetch('https://services.leadconnectorhq.com/v1/contacts/count', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      'Version': '2021-07-28', // Use the correct API version if required
    },
  });
  const testData = await testRes.json();

  // Prepare data for DB
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Upsert integration record
  const { error } = await supabase
    .from('user_integrations')
    .upsert([{
      user_id: userId,
      integration_type: 'leadconnector',
      connection_method: 'oauth',
      credentials: {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type,
      },
      status: 'connected',
      last_synced_at: new Date().toISOString(),
      synced_data: { contact_count: testData.count || 0 },
      updated_at: new Date().toISOString(),
    }], { onConflict: ['user_id', 'integration_type'] });

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to store integration', details: error }),
    };
  }

  // Redirect user to frontend success page (or show a message)
  return {
    statusCode: 302,
    headers: {
      Location: process.env.OAUTH_SUCCESS_REDIRECT || 'https://yourfrontend.com/integrations?success=1',
    },
    body: '',
  };
}; 