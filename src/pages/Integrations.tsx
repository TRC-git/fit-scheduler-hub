import React, { useEffect, useState } from 'react';
import {
  getIntegrations,
  initiateOAuth,
  manualConnect,
  syncLeadConnector,
  disconnectLeadConnector,
} from '../integrations/api';

type Integration = {
  name: string;
  type: string;
  status: string;
  synced_data?: { contact_count?: number };
  last_synced_at?: string;
};

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pit, setPit] = useState('');
  const [locationId, setLocationId] = useState('');

  useEffect(() => {
    getIntegrations().then(data => setIntegrations(data.integrations));
  }, []);

  const handleOAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const { url } = await initiateOAuth();
      window.location.href = url; // Redirect to GoHighLevel OAuth
    } catch (e) {
      setError('Failed to initiate OAuth');
    } finally {
      setLoading(false);
    }
  };

  const handleManualConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await manualConnect(pit, locationId);
      if (res.error) setError(res.error);
      else getIntegrations().then(data => setIntegrations(data.integrations));
    } catch (e) {
      setError('Manual connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    setError(null);
    try {
      await syncLeadConnector();
      getIntegrations().then(data => setIntegrations(data.integrations));
    } catch (e) {
      setError('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    setError(null);
    try {
      await disconnectLeadConnector();
      getIntegrations().then(data => setIntegrations(data.integrations));
    } catch (e) {
      setError('Disconnect failed');
    } finally {
      setLoading(false);
    }
  };

  // Render cards for each integration (simplified)
  return (
    <div>
      <h1>Integrations</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {integrations.map(integration => (
        <div key={integration.type} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
          <h2>{integration.name}</h2>
          <p>Status: {integration.status}</p>
          {integration.type === 'leadconnector' && (
            <>
              {integration.status === 'not_connected' && (
                <>
                  <button onClick={handleOAuth} disabled={loading}>Connect via OAuth</button>
                  <div style={{ marginTop: 8 }}>
                    <input
                      type="text"
                      placeholder="PIT"
                      value={pit}
                      onChange={e => setPit(e.target.value)}
                      disabled={loading}
                    />
                    <input
                      type="text"
                      placeholder="Location ID"
                      value={locationId}
                      onChange={e => setLocationId(e.target.value)}
                      disabled={loading}
                    />
                    <button onClick={handleManualConnect} disabled={loading || !pit || !locationId}>
                      Connect Manually
                    </button>
                  </div>
                </>
              )}
              {integration.status === 'connected' && (
                <>
                  <button onClick={handleSync} disabled={loading}>Sync Again</button>
                  <button onClick={handleDisconnect} disabled={loading}>Disconnect</button>
                  {integration.synced_data && (
                    <div>Contacts Synced: {integration.synced_data.contact_count}</div>
                  )}
                  <div>Last Synced: {integration.last_synced_at}</div>
                </>
              )}
              {integration.status === 'disconnected' && (
                <button onClick={handleOAuth} disabled={loading}>Reconnect</button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
} 