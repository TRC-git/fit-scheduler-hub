import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { verifySupabaseJwt } from './verifySupabaseJwt.js';
import localCredentials from './localCredentials.js';

// Add CORS headers for production
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

const handler = async (event, context) => {
  console.log('Manual connect function started');
  
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

  if (event.httpMethod !== 'POST') {
    console.log('Invalid method:', event.httpMethod);
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    console.log('Authenticating user');
    // Authenticate user using Supabase JWT
    const userId = verifySupabaseJwt(event.headers.authorization);
    if (!userId) {
      console.log('Authentication failed');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }
    console.log('User authenticated:', userId);

    // Parse request body
    let body;
    try {
      body = JSON.parse(event.body);
      console.log('Request body parsed successfully');
    } catch (e) {
      console.error('Invalid JSON in request body:', e.message);
      return { 
        statusCode: 400, 
        headers,
        body: JSON.stringify({ error: 'Invalid JSON' }) 
      };
    }

    const { pit, location_id } = body;
    if (!pit || !location_id) {
      console.log('Missing PIT or Location ID');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing PIT or Location ID' }),
      };
    }

    console.log('Testing credentials with GoHighLevel API');
    // Test the credentials by fetching contact count
    const testRes = await fetch(`https://services.leadconnectorhq.com/v1/contacts/count?locationId=${location_id}`, {
      headers: {
        Authorization: `Bearer ${pit}`,
        'Version': '2021-07-28',
      },
    });

    const testData = await testRes.json();
    console.log('GoHighLevel API response status:', testRes.status);

    if (!testRes.ok || typeof testData.count !== 'number') {
      console.log('Invalid credentials or API error:', testData);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid PIT or Location ID', details: testData }),
      };
    }

    console.log('Credentials validated, contact count:', testData.count);

    console.log('Connecting to Supabase');
    // Store credentials in Supabase with environment variables or local credentials
    const supabaseUrl = process.env.SUPABASE_URL || localCredentials.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || localCredentials.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client created');

    console.log('Storing integration in database');
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
      console.error('Database error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to store integration', details: error }),
      };
    }

    console.log('Integration stored successfully');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Manual connection successful',
        contact_count: testData.count,
      }),
    };

  } catch (error) {
    console.error('Unexpected error in manual-connect function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack 
      }),
    };
  }
};

export { handler as default }; 
