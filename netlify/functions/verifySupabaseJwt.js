
const jwt = require('jsonwebtoken');
const localCredentials = require('./localCredentials');

// Use environment variable with fallback to local credentials
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || localCredentials.SUPABASE_JWT_SECRET;

function verifySupabaseJwt(authHeader) {
  if (!authHeader) {
    console.log('No auth header provided');
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    console.log('Attempting to verify JWT token');
    
    // Try to verify the JWT with different secret formats in case the format is wrong
    let payload;
    try {
      // Try with the raw secret
      payload = jwt.verify(token, SUPABASE_JWT_SECRET);
      console.log('JWT verification successful with raw secret, user ID:', payload.sub);
    } catch (rawError) {
      console.error('JWT verification with raw secret failed:', rawError.message);
      
      try {
        // Try with the base64 decoded secret (if the secret is in base64 format)
        const decodedSecret = Buffer.from(SUPABASE_JWT_SECRET, 'base64').toString('utf8');
        payload = jwt.verify(token, decodedSecret);
        console.log('JWT verification successful with decoded base64 secret, user ID:', payload.sub);
      } catch (decodedError) {
        console.error('JWT verification with decoded base64 secret failed too:', decodedError.message);
        
        try {
          // Try with different JWT algorithms
          const algorithms = ['HS256', 'HS384', 'HS512'];
          for (const algorithm of algorithms) {
            try {
              payload = jwt.verify(token, SUPABASE_JWT_SECRET, { algorithms: [algorithm] });
              console.log(`JWT verification successful with algorithm ${algorithm}, user ID:`, payload.sub);
              break;
            } catch (algError) {
              console.error(`JWT verification with algorithm ${algorithm} failed:`, algError.message);
            }
          }
          
          if (!payload) {
            throw new Error('Failed to verify token with any algorithm');
          }
        } catch (algError) {
          throw rawError; // Re-throw the original error
        }
      }
    }
    
    return payload.sub; // This is the user ID
  } catch (e) {
    console.error('JWT verification failed:', e.message);
    console.error('JWT token (first 20 chars):', token.substring(0, 20) + '...');
    console.error('JWT secret (length):', SUPABASE_JWT_SECRET ? SUPABASE_JWT_SECRET.length : 'undefined');
    return null;
  }
}

module.exports = { verifySupabaseJwt }; 
