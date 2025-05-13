
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

  if (event.httpMethod !== 'DELETE') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

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

  // Remove credentials and mark as disconnected
  const { error } = await supabase
    .from('user_integrations')
    .update({
      credentials: {},
      status: 'disconnected',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('integration_type', 'leadconnector');

  if (error) {
    console.error('Supabase error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to disconnect integration', details: error }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: 'Integration disconnected' }),
  };
};
