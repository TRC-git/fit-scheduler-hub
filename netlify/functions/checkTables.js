const ensureUserIntegrationsTable = async (supabase) => {
  try {
    console.log("Checking if user_integrations table exists");
    
    // First, try to query the table directly to see if it exists
    const { data, error } = await supabase
      .from('user_integrations')
      .select('id')
      .limit(1);
    
    if (!error) {
      // Table exists and is accessible
      console.log("user_integrations table exists and is accessible");
      return true;
    }
    
    // If we get here, the table might not exist or there's a permission issue
    console.log("user_integrations table query failed:", error.message);
    
    // Try to call the RPC function if it exists
    try {
      const { data: rpcResult, error: rpcError } = await supabase
        .rpc('check_and_create_user_integrations_table');
      
      if (!rpcError) {
        console.log("RPC function executed successfully");
        return true;
      } else {
        console.log("RPC function failed:", rpcError.message);
      }
    } catch (rpcErr) {
      console.log("RPC function call failed:", rpcErr.message);
    }
    
    // If everything fails, assume the table setup is incomplete
    console.error("Could not verify or create user_integrations table");
    console.error("Please run the database setup script: supabase/functions/create_complete_integration_tables.sql");
    
    return false;
    
  } catch (err) {
    console.error("Unexpected error in ensureUserIntegrationsTable:", err);
    return false;
  }
};

module.exports = { ensureUserIntegrationsTable };
