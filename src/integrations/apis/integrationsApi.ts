
import { fetchWithErrorHandling, getAuthHeader, BASE_API_URL } from '../utils/fetchUtils';

export async function getIntegrations() {
  try {
    const headers = await getAuthHeader();
    console.log('Fetching integrations...');
    return await fetchWithErrorHandling(`${BASE_API_URL}/get-integrations`, { headers, credentials: 'include' });
  } catch (error) {
    console.error('Failed to get integrations:', error);
    // Return a default response to prevent UI crashes
    return { integrations: [] };
  }
}

export async function initiateOAuth() {
  try {
    const headers = await getAuthHeader();
    return await fetchWithErrorHandling(`${BASE_API_URL}/oauth-initiate`, { method: 'POST', headers, credentials: 'include' });
  } catch (error) {
    console.error('Failed to initiate OAuth:', error);
    throw error;
  }
}

export async function manualConnect(pit: string, location_id: string) {
  try {
    const headers = { ...(await getAuthHeader()), 'Content-Type': 'application/json' };
    return await fetchWithErrorHandling(`${BASE_API_URL}/manual-connect`, {
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
    return await fetchWithErrorHandling(`${BASE_API_URL}/sync`, { method: 'POST', headers, credentials: 'include' });
  } catch (error) {
    console.error('Failed to sync:', error);
    throw error;
  }
}

export async function disconnectLeadConnector() {
  try {
    const headers = await getAuthHeader();
    return await fetchWithErrorHandling(`${BASE_API_URL}/disconnect`, { method: 'DELETE', headers, credentials: 'include' });
  } catch (error) {
    console.error('Failed to disconnect:', error);
    throw error;
  }
}
