
import React, { useState } from 'react';
import { 
  initiateOAuth, 
  manualConnect, 
  syncLeadConnector, 
  disconnectLeadConnector 
} from '../../integrations/apis/integrationsApi';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Integration } from './IntegrationCard';

interface LeadConnectorIntegrationProps {
  integration: Integration;
}

export const LeadConnectorIntegration: React.FC<LeadConnectorIntegrationProps> = ({ integration }) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pit, setPit] = useState('');
  const [locationId, setLocationId] = useState('');
  const { toast } = useToast();

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
        // Force reload to refresh the integration status
        window.location.reload();
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
      // Force reload to refresh the integration status
      window.location.reload();
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
      // Force reload to refresh the integration status
      window.location.reload();
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

  return (
    <div
      className="bg-fitness-card rounded-lg p-6 shadow mb-6 max-w-xl border border-fitness-border"
    >
      <div className="font-bold text-fitness-text mb-2">{integration.name}</div>
      <div className="mb-2 text-fitness-text">
        Status: <span className={`font-semibold ${integration.status === 'connected' ? 'text-green-400' : ''}`}>
          {integration.status}
        </span>
      </div>
      
      {integration.status === 'not_connected' && (
        <>
          <button
            className="bg-fitness-accent text-black px-4 py-2 rounded mr-2 hover:bg-fitness-accent-dark transition disabled:opacity-50"
            onClick={handleOAuth}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> Processing...</>
            ) : (
              'Connect via OAuth'
            )}
          </button>
          <div className="flex flex-col md:flex-row gap-2 mt-2">
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
              {actionLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> Processing...</>
              ) : (
                'Connect Manually'
              )}
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
            {actionLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> Processing...</>
            ) : (
              'Sync Again'
            )}
          </button>
          <button
            className="bg-fitness-danger text-white px-4 py-2 rounded hover:bg-fitness-danger-dark transition disabled:opacity-50"
            onClick={handleDisconnect}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> Processing...</>
            ) : (
              'Disconnect'
            )}
          </button>
          {integration.synced_data && (
            <div className="mt-2 text-fitness-text">
              Contacts Synced: {integration.synced_data.contact_count || 0}
            </div>
          )}
          <div className="text-fitness-text">
            Last Synced: {integration.last_synced_at ? new Date(integration.last_synced_at).toLocaleString() : 'Never'}
          </div>
        </>
      )}
      
      {integration.status === 'disconnected' && (
        <button
          className="bg-fitness-accent text-black px-4 py-2 rounded hover:bg-fitness-accent-dark transition disabled:opacity-50"
          onClick={handleOAuth}
          disabled={actionLoading}
        >
          {actionLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> Processing...</>
          ) : (
            'Reconnect'
          )}
        </button>
      )}
      
      {error && (
        <div className="mt-2 text-red-400 p-2 bg-red-100/10 border border-red-400 rounded">
          {error}
        </div>
      )}
    </div>
  );
};
