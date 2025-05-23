import React from 'react';
import { Loader2, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { syncLeadConnector, disconnectLeadConnector, syncUsersAndCalendars } from '@/integrations/apis/integrationsApi';
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
        description: "Contact sync completed successfully",
      });
      // Force reload to refresh the integration status
      window.location.reload();
    } catch (e) {
      setError('Contact sync failed');
      toast({
        title: "Error",
        description: "Contact sync failed",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUsersCalendarsSync = async () => {
    setActionLoading(true);
    setError(null);
    try {
      await syncUsersAndCalendars();
      toast({
        title: "Success",
        description: "Users and calendars sync completed successfully",
      });
      // Force reload to refresh the integration status
      window.location.reload();
    } catch (e) {
      setError('Users and calendars sync failed');
      toast({
        title: "Error",
        description: "Users and calendars sync failed",
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
    <div className="space-y-3">
      {/* Contact Sync Button */}
      <Button
        onClick={handleSync}
        disabled={actionLoading}
        className="w-full bg-fitness-accent text-black hover:bg-fitness-accent-dark"
      >
        {actionLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
        ) : (
          'Sync Contacts'
        )}
      </Button>

      {/* Users & Calendars Sync Button */}
      <Button
        onClick={handleUsersCalendarsSync}
        disabled={actionLoading}
        variant="outline"
        className="w-full border-fitness-accent text-fitness-accent hover:bg-fitness-accent hover:text-black"
      >
        {actionLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
        ) : (
          <>
            <Users className="h-4 w-4 mr-2" />
            <Calendar className="h-4 w-4 mr-2" />
            Sync Users & Calendars
          </>
        )}
      </Button>
      
      {/* Show sync statistics */}
      {integration.synced_data && (
        <div className="text-sm text-fitness-text/80 space-y-1">
          {integration.synced_data.contact_count && (
            <div>Contacts: {integration.synced_data.contact_count}</div>
          )}
          {integration.synced_data.users_count && (
            <div>Users: {integration.synced_data.users_count}</div>
          )}
          {integration.synced_data.calendars_count && (
            <div>Calendars: {integration.synced_data.calendars_count}</div>
          )}
        </div>
      )}

      {/* Disconnect Button */}
      <Button
        onClick={handleDisconnect}
        disabled={actionLoading}
        variant="destructive"
        className="w-full"
      >
        {actionLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
        ) : (
          'Disconnect'
        )}
      </Button>
    </div>
  );
};
