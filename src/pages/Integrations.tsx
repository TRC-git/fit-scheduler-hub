
import React, { useEffect, useState } from 'react';
import {
  getIntegrations,
  initiateOAuth,
  manualConnect,
  syncLeadConnector,
  disconnectLeadConnector,
} from '../integrations/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pit, setPit] = useState('');
  const [locationId, setLocationId] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    async function loadIntegrations() {
      setLoading(true);
      setError(null);
      try {
        const data = await getIntegrations();
        setIntegrations(data.integrations);
      } catch (err) {
        console.error('Failed to load integrations:', err);
        setError('Failed to load integrations. Please try again.');
        toast({
          title: "Error",
          description: "Failed to load integrations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadIntegrations();
  }, [toast]);

  const handleOAuth = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const { url } = await initiateOAuth();
      window.location.href = url; // Redirect to GoHighLevel OAuth
    } catch (e) {
      setError('Failed to initiate OAuth');
      toast({
        title: "Error",
        description: "Failed to initiate OAuth",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleManualConnect = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await manualConnect(pit, locationId);
      if (res.error) {
        setError(res.error);
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Connected successfully",
        });
        const data = await getIntegrations();
        setIntegrations(data.integrations);
      }
    } catch (e) {
      setError('Manual connection failed');
      toast({
        title: "Error",
        description: "Manual connection failed",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSync = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await syncLeadConnector();
      toast({
        title: "Success",
        description: "Sync completed successfully",
      });
      const data = await getIntegrations();
      setIntegrations(data.integrations);
    } catch (e) {
      setError('Sync failed');
      toast({
        title: "Error",
        description: "Sync failed",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await disconnectLeadConnector();
      toast({
        title: "Success",
        description: "Disconnected successfully",
      });
      const data = await getIntegrations();
      setIntegrations(data.integrations);
    } catch (e) {
      setError('Disconnect failed');
      toast({
        title: "Error",
        description: "Disconnect failed",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-fitness-accent mb-4" />
        <p className="text-fitness-text">Loading integrations...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-fitness-text">Integrations</h2>
      {error && <div className="text-red-400 mb-2 p-3 bg-red-100/10 border border-red-400 rounded">{error}</div>}
      
      {integrations.length === 0 ? (
        <div className="bg-fitness-card rounded-lg p-6 shadow mb-6 max-w-xl border border-fitness-border">
          <p className="text-fitness-text">No integrations found. Try refreshing the page.</p>
        </div>
      ) : (
        integrations.map(integration => (
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
                      className="bg-fitness-accent text-black px-4 py-2 rounded mr-2 hover:bg-fitness-accent-dark transition disabled:opacity-50"
                      onClick={handleOAuth}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Processing...' : 'Connect via OAuth'}
                    </button>
                    <div className="flex gap-2 mt-2">
                      <input
                        className="bg-fitness-input text-fitness-text border border-fitness-border rounded px-2 py-1"
                        type="text"
                        placeholder="PIT"
                        value={pit}
                        onChange={e => setPit(e.target.value)}
                        disabled={actionLoading}
                      />
                      <input
                        className="bg-fitness-input text-fitness-text border border-fitness-border rounded px-2 py-1"
                        type="text"
                        placeholder="Location ID"
                        value={locationId}
                        onChange={e => setLocationId(e.target.value)}
                        disabled={actionLoading}
                      />
                      <button
                        className="bg-fitness-accent text-black px-4 py-2 rounded hover:bg-fitness-accent-dark transition disabled:opacity-50"
                        onClick={handleManualConnect}
                        disabled={actionLoading || !pit || !locationId}
                      >
                        {actionLoading ? 'Processing...' : 'Connect Manually'}
                      </button>
                    </div>
                  </>
                )}
                {integration.status === 'connected' && (
                  <>
                    <button
                      className="bg-fitness-accent text-black px-4 py-2 rounded mr-2 hover:bg-fitness-accent-dark transition disabled:opacity-50"
                      onClick={handleSync}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Processing...' : 'Sync Again'}
                    </button>
                    <button
                      className="bg-fitness-danger text-white px-4 py-2 rounded hover:bg-fitness-danger-dark transition disabled:opacity-50"
                      onClick={handleDisconnect}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Processing...' : 'Disconnect'}
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
                    className="bg-fitness-accent text-black px-4 py-2 rounded hover:bg-fitness-accent-dark transition disabled:opacity-50"
                    onClick={handleOAuth}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Reconnect'}
                  </button>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
