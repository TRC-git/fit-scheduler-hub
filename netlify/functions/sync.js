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

  // Connect to Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Get the user's LeadConnector integration
  const { data, error } = await supabase
    .from('user_integrations')
    .select('*')
    .eq('user_id', userId)
    .eq('integration_type', 'leadconnector')
    .single();

  if (error || !data) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Integration not found' }),
    };
  }

  let accessToken, locationId, pit;
  if (data.connection_method === 'oauth') {
    accessToken = data.credentials.access_token;
    locationId = data.credentials.location_id;
  } else if (data.connection_method === 'manual') {
    pit = data.credentials.pit;
    locationId = data.credentials.location_id;
  }

  // Fetch contact count
  const apiUrl = `https://services.leadconnectorhq.com/v1/contacts/count?locationId=${locationId}`;
  const headers = {
    'Version': '2021-07-28',
    Authorization: accessToken ? `Bearer ${accessToken}` : `Bearer ${pit}`,
  };

  const apiRes = await fetch(apiUrl, { headers });
  const apiData = await apiRes.json();

  if (!apiRes.ok || typeof apiData.count !== 'number') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Failed to sync', details: apiData }),
    };
  }

  // Update integration record
  const { error: updateError } = await supabase
    .from('user_integrations')
    .update({
      last_synced_at: new Date().toISOString(),
      synced_data: { contact_count: apiData.count },
      updated_at: new Date().toISOString(),
    })
    .eq('id', data.id);

  if (updateError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update integration', details: updateError }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Sync successful',
      contact_count: apiData.count,
    }),
  };
}; 