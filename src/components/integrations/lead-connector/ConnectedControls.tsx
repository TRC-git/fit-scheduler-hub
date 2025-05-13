
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { syncLeadConnector, disconnectLeadConnector } from '@/integrations/apis/integrationsApi';
import { useToast } from '@/hooks/use-toast';
import { Integration } from '../IntegrationCard';

interface ConnectedControlsProps {
  integration: Integration;
  setActionLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  actionLoading: boolean;
}

export const ConnectedControls: React.FC<ConnectedControlsProps> = ({
  integration,
  setActionLoading,
  setError,
  actionLoading,
}) => {
  const { toast } = useToast();

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
    <div className="space-y-4">
      <div className="space-y-1">
        {integration.synced_data && (
          <div className="text-fitness-text">
            Contacts Synced: <span className="font-semibold">{integration.synced_data.contact_count || 0}</span>
          </div>
        )}
        <div className="text-fitness-text">
          Last Synced: <span className="font-semibold">{integration.last_synced_at ? new Date(integration.last_synced_at).toLocaleString() : 'Never'}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          onClick={handleSync}
          disabled={actionLoading}
          className="bg-fitness-accent text-black hover:bg-fitness-accent-dark"
        >
          {actionLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
          ) : (
            'Sync Again'
          )}
        </Button>
        
        <Button
          onClick={handleDisconnect}
          disabled={actionLoading}
          variant="destructive"
        >
          {actionLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
          ) : (
            'Disconnect'
          )}
        </Button>
      </div>
    </div>
  );
};
