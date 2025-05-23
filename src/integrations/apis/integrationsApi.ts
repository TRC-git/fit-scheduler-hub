import { fetchWithErrorHandling, getAuthHeader, BASE_API_URL } from '../utils/fetchUtils';

export async function getIntegrations() {
  try {
    const headers = await getAuthHeader();
    console.log('Fetching integrations...');
    const response = await fetchWithErrorHandling(`${BASE_API_URL}/get-integrations`, { headers, credentials: 'include' });
    return response;
  } catch (error) {
    console.error('Failed to get integrations:', error);
    // Return a default response with an empty array of integrations instead of throwing
    return { 
      integrations: [
        {
          name: 'LeadConnector',
          type: 'leadconnector',
          status: 'not_connected',
          synced_data: {},
          last_synced_at: null,
        }
      ] 
    };
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

export async function manualConnect(pit: string, locationId: string) {
  try {
    const headers = await getAuthHeader();
    return await fetchWithErrorHandling(`${BASE_API_URL}/manual-connect`, { 
      method: 'POST', 
      headers, 
      credentials: 'include',
      body: JSON.stringify({ pit, location_id: locationId })
    });
  } catch (error) {
    console.error('Failed to manual connect:', error);
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

// NEW: Function to sync users and calendars data
export async function syncUsersAndCalendars() {
  try {
    const headers = await getAuthHeader();
    console.log('Syncing users and calendars...');
    return await fetchWithErrorHandling(`${BASE_API_URL}/sync-users-calendars`, { 
      method: 'POST', 
      headers, 
      credentials: 'include' 
    });
  } catch (error) {
    console.error('Failed to sync users and calendars:', error);
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
