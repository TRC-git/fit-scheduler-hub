const jwt = require('jsonwebtoken');

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

function verifySupabaseJwt(authHeader) {
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, SUPABASE_JWT_SECRET);
    return payload.sub; // This is the user ID
  } catch (e) {
    return null;
  }
}

module.exports = { verifySupabaseJwt }; 