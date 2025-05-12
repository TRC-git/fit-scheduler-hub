import { supabase } from './supabase/client';

const base = '/.netlify/functions';

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
  const headers = await getAuthHeader();
  const res = await fetch(`${base}/get-integrations`, { headers, credentials: 'include' });
  return res.json();
}

export async function initiateOAuth() {
  const headers = await getAuthHeader();
  const res = await fetch(`${base}/oauth-initiate`, { method: 'POST', headers, credentials: 'include' });
  return res.json();
}

export async function manualConnect(pit: string, location_id: string) {
  const headers = { ...(await getAuthHeader()), 'Content-Type': 'application/json' };
  const res = await fetch(`${base}/manual-connect`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ pit, location_id }),
  });
  return res.json();
}

export async function syncLeadConnector() {
  const headers = await getAuthHeader();
  const res = await fetch(`${base}/sync`, { method: 'POST', headers, credentials: 'include' });
  return res.json();
}

export async function disconnectLeadConnector() {
  const headers = await getAuthHeader();
  const res = await fetch(`${base}/disconnect`, { method: 'DELETE', headers, credentials: 'include' });
  return res.json();
} 