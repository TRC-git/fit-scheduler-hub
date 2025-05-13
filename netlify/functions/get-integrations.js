
const { createClient } = require('@supabase/supabase-js');
const { verifySupabaseJwt } = require('./verifySupabaseJwt');
const localCredentials = require('./localCredentials');

exports.handler = async (event, context) => {
  // Authenticate user using Supabase JWT
  const userId = verifySupabaseJwt(event.headers.authorization);
  if (!userId) {
    return {
      statusCode: 401,
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  // You can also return a list of all possible integrations with their status
  const integrations = [
    {
      name: 'LeadConnector',
      type: 'leadconnector',
      status: data.find(i => i.integration_type === 'leadconnector')?.status || 'not_connected',
      // ...other fields
    },
    // Add other integrations as needed
  ];

  return {
    statusCode: 200,
    body: JSON.stringify({ integrations }),
  };
}; 
