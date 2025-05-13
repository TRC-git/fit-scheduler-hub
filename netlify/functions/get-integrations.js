
const { createClient } = require('@supabase/supabase-js');
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

  // Authenticate user using Supabase JWT
  const userId = verifySupabaseJwt(event.headers.authorization);
  if (!userId) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  // Connect to Supabase with environment variables or local credentials
  const supabase = createClient(
    process.env.SUPABASE_URL || localCredentials.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || localCredentials.SUPABASE_SERVICE_ROLE_KEY
  );

  // Fetch integrations for this user
  const { data, error } = await supabase
    .from('user_integrations')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Supabase error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }

  // You can also return a list of all possible integrations with their status
  const integrations = [
    {
      name: 'LeadConnector',
      type: 'leadconnector',
      status: data?.find(i => i.integration_type === 'leadconnector')?.status || 'not_connected',
      synced_data: data?.find(i => i.integration_type === 'leadconnector')?.synced_data || {},
      last_synced_at: data?.find(i => i.integration_type === 'leadconnector')?.last_synced_at || null,
    },
    // Add other integrations as needed
  ];

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ integrations }),
  };
};
