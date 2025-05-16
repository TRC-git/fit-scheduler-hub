
// Helper to get auth header for API requests
export async function getAuthHeader() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      console.log('Got auth token for API request');
      return { Authorization: `Bearer ${session.access_token}` };
    }
  } catch (err) {
    console.error('Failed to get auth session:', err);
  }
  console.warn('No auth token available for API request');
  return {};
}

// Base URL for Netlify functions
export const BASE_API_URL = '/.netlify/functions';

// Helper to handle fetch errors and parse JSON safely
export async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, options);
    
    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      
      // For 404 errors, provide a more specific message
      if (response.status === 404) {
        throw new Error(`API endpoint not found: ${url}`);
      }
      
      // For 500 errors related to authentication
      if (response.status === 500 && errorText.includes('Unauthorized')) {
        throw new Error('Authentication failed. Please log in again.');
      }
      
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Check if content type is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      if (!text || text.trim() === '') {
        console.log('Empty response received');
        return {};
      }
      
      try {
        // Try to parse it as JSON anyway
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Unexpected response format:', text);
        console.error('Parse error:', parseError);
        
        // If it starts with <!DOCTYPE, it's probably a 404 HTML page
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
          throw new Error('Received HTML instead of JSON. API endpoint may not be properly configured.');
        }
        
        throw new Error('Invalid response format from API');
      }
    }
  } catch (error: any) {
    console.error('API request error:', error);
    throw error;
  }
}
