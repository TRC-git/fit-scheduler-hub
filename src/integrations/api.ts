
import { supabase } from './supabase/client';

const base = '/.netlify/functions';

// Helper to handle fetch errors and parse JSON safely
async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, options);
    
    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }

    // Check if content type is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      console.error('Unexpected response format:', text);
      throw new Error('Invalid response format from API');
    }
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

async function getAuthHeader() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    return { Authorization: `Bearer ${session.access_token}` };
  }
  return {};
}

export async function getIntegrations() {
  try {
    const headers = await getAuthHeader();
    return await fetchWithErrorHandling(`${base}/get-integrations`, { headers, credentials: 'include' });
  } catch (error) {
    console.error('Failed to get integrations:', error);
    return { integrations: [] };
  }
}

export async function initiateOAuth() {
  try {
    const headers = await getAuthHeader();
    return await fetchWithErrorHandling(`${base}/oauth-initiate`, { method: 'POST', headers, credentials: 'include' });
  } catch (error) {
    console.error('Failed to initiate OAuth:', error);
    throw error;
  }
}

export async function manualConnect(pit: string, location_id: string) {
  try {
    const headers = { ...(await getAuthHeader()), 'Content-Type': 'application/json' };
    return await fetchWithErrorHandling(`${base}/manual-connect`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ pit, location_id }),
    });
  } catch (error) {
    console.error('Failed to connect manually:', error);
    throw error;
  }
}

export async function syncLeadConnector() {
  try {
    const headers = await getAuthHeader();
    return await fetchWithErrorHandling(`${base}/sync`, { method: 'POST', headers, credentials: 'include' });
  } catch (error) {
    console.error('Failed to sync:', error);
    throw error;
  }
}

export async function disconnectLeadConnector() {
  try {
    const headers = await getAuthHeader();
    return await fetchWithErrorHandling(`${base}/disconnect`, { method: 'DELETE', headers, credentials: 'include' });
  } catch (error) {
    console.error('Failed to disconnect:', error);
    throw error;
  }
}
