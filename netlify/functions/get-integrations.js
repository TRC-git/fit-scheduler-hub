
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
  console.log("Get integrations function called");
  
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
    console.log("Verifying Supabase JWT");
    // Authenticate user using Supabase JWT
    const userId = verifySupabaseJwt(event.headers.authorization);
    console.log("User authentication result:", userId ? "Authenticated" : "Not authenticated");
    
    if (!userId) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    console.log("Connecting to Supabase");
    // Connect to Supabase with environment variables or local credentials
    const supabaseUrl = process.env.SUPABASE_URL || localCredentials.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || localCredentials.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase URL or service role key");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Checking if user_integrations table exists");
    // First check if the user_integrations table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'user_integrations');
      
    if (tablesError) {
      console.error("Error checking tables:", tablesError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Database schema error', details: tablesError.message }),
      };
    }

    let data = [];
    let error = null;
    
    if (tables && tables.length > 0) {
      console.log("Fetching integrations for user:", userId);
      // Fetch integrations for this user
      const result = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', userId);
        
      data = result.data || [];
      error = result.error;
      
      if (error) {
        console.error("Supabase query error:", error);
      } else {
        console.log(`Found ${data.length} integrations for user`);
      }
    } else {
      console.log("user_integrations table does not exist, returning empty array");
    }

    // Create a list of integrations with status info
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
  } catch (err) {
    console.error("Unexpected error in get-integrations function:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: err.message }),
    };
  }
};
