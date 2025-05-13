
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
    const payload = jwt.verify(token, SUPABASE_JWT_SECRET);
    console.log('JWT verification successful, user ID:', payload.sub);
    return payload.sub; // This is the user ID
  } catch (e) {
    console.error('JWT verification failed:', e.message);
    return null;
  }
}

module.exports = { verifySupabaseJwt }; 
