const { createClient } = require('@supabase/supabase-js');
const { verifySupabaseJwt } = require('./verifySupabaseJwt');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Authenticate user using Supabase JWT
  const userId = verifySupabaseJwt(event.headers.authorization);
  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  // Connect to Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to disconnect integration', details: error }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Integration disconnected' }),
  };
}; 