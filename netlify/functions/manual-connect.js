const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const { verifySupabaseJwt } = require('./verifySupabaseJwt');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
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

  // Parse request body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { pit, location_id } = body;
  if (!pit || !location_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing PIT or Location ID' }),
    };
  }

  // Test the credentials by fetching contact count
  const testRes = await fetch(`https://services.leadconnectorhq.com/v1/contacts/count?locationId=${location_id}`, {
    headers: {
      Authorization: `Bearer ${pit}`,
      'Version': '2021-07-28', // Use the correct API version if required
    },
  });

  const testData = await testRes.json();

  if (!testRes.ok || typeof testData.count !== 'number') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid PIT or Location ID', details: testData }),
    };
  }

  // Store credentials in Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabase
    .from('user_integrations')
    .upsert([{
      user_id: userId,
      integration_type: 'leadconnector',
      connection_method: 'manual',
      credentials: {
        pit,
        location_id,
      },
      status: 'connected',
      last_synced_at: new Date().toISOString(),
      synced_data: { contact_count: testData.count },
      updated_at: new Date().toISOString(),
    }], { onConflict: ['user_id', 'integration_type'] });

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to store integration', details: error }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Manual connection successful',
      contact_count: testData.count,
    }),
  };
}; 