import React, { useEffect, useState } from 'react';
import {
  getIntegrations,
  initiateOAuth,
  manualConnect,
  syncLeadConnector,
  disconnectLeadConnector,
} from '../integrations/api';

// Type for integration
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-fitness-text">Integrations</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {integrations.map(integration => (
        <div
          key={integration.type}
          className="bg-fitness-card rounded-lg p-6 shadow mb-6 max-w-xl border border-fitness-border"
        >
          <div className="font-bold text-fitness-text mb-2">{integration.name}</div>
          <div className="mb-2 text-fitness-text">
            Status: <span className="font-semibold">{integration.status}</span>
          </div>
          {integration.type === 'leadconnector' && (
            <>
              {integration.status === 'not_connected' && (
                <>
                  <button
                    className="bg-fitness-accent text-black px-4 py-2 rounded mr-2 hover:bg-fitness-accent-dark transition"
                    onClick={handleOAuth}
                    disabled={loading}
                  >
                    Connect via OAuth
                  </button>
                  <div className="flex gap-2 mt-2">
                    <input
                      className="bg-fitness-input text-fitness-text border border-fitness-border rounded px-2 py-1"
                      type="text"
                      placeholder="PIT"
                      value={pit}
                      onChange={e => setPit(e.target.value)}
                      disabled={loading}
                    />
                    <input
                      className="bg-fitness-input text-fitness-text border border-fitness-border rounded px-2 py-1"
                      type="text"
                      placeholder="Location ID"
                      value={locationId}
                      onChange={e => setLocationId(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      className="bg-fitness-accent text-black px-4 py-2 rounded hover:bg-fitness-accent-dark transition"
                      onClick={handleManualConnect}
                      disabled={loading || !pit || !locationId}
                    >
                      Connect Manually
                    </button>
                  </div>
                </>
              )}
              {integration.status === 'connected' && (
                <>
                  <button
                    className="bg-fitness-accent text-black px-4 py-2 rounded mr-2 hover:bg-fitness-accent-dark transition"
                    onClick={handleSync}
                    disabled={loading}
                  >
                    Sync Again
                  </button>
                  <button
                    className="bg-fitness-danger text-white px-4 py-2 rounded hover:bg-fitness-danger-dark transition"
                    onClick={handleDisconnect}
                    disabled={loading}
                  >
                    Disconnect
                  </button>
                  {integration.synced_data && (
                    <div className="mt-2 text-fitness-text">
                      Contacts Synced: {integration.synced_data.contact_count}
                    </div>
                  )}
                  <div className="text-fitness-text">Last Synced: {integration.last_synced_at}</div>
                </>
              )}
              {integration.status === 'disconnected' && (
                <button
                  className="bg-fitness-accent text-black px-4 py-2 rounded hover:bg-fitness-accent-dark transition"
                  onClick={handleOAuth}
                  disabled={loading}
                >
                  Reconnect
                </button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
} 