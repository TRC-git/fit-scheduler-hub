
import React, { useState } from 'react';
import { 
  initiateOAuth, 
  manualConnect, 
  syncLeadConnector, 
  disconnectLeadConnector 
} from '../../integrations/apis/integrationsApi';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Info } from 'lucide-react';
import { Integration } from './IntegrationCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
      <h3 className="text-xl font-bold text-fitness-text mb-2">{integration.name}</h3>
      <div className="mb-4 text-fitness-text">
        Status: <span className={`font-semibold ${integration.status === 'connected' ? 'text-green-400' : 'text-amber-400'}`}>
          {integration.status}
        </span>
      </div>
      
      {integration.status === 'not_connected' && (
        <Tabs defaultValue="oauth" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="oauth" className="flex-1">Connect via OAuth</TabsTrigger>
            <TabsTrigger value="manual" className="flex-1">Connect Manually</TabsTrigger>
          </TabsList>
          
          <TabsContent value="oauth" className="pt-2">
            <p className="text-sm text-muted-foreground mb-4">
              Connect directly using GoHighLevel OAuth for a simpler setup process.
            </p>
            <Button 
              onClick={handleOAuth}
              disabled={actionLoading}
              className="w-full"
            >
              {actionLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
              ) : (
                'Connect via OAuth'
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center">
                <label htmlFor="pit" className="text-sm font-medium text-fitness-text mr-2">
                  Private Integration Token
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      Make sure to add read/write on Contacts, Users, Custom Values and Custom Fields. Along with Read Locations.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="pit"
                type="text"
                placeholder="Enter your PIT"
                value={pit}
                onChange={e => setPit(e.target.value)}
                disabled={actionLoading}
                className="w-full bg-fitness-input text-fitness-text"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="locationId" className="text-sm font-medium text-fitness-text">
                Location ID
              </label>
              <Input
                id="locationId"
                type="text"
                placeholder="Enter your Location ID"
                value={locationId}
                onChange={e => setLocationId(e.target.value)}
                disabled={actionLoading}
                className="w-full bg-fitness-input text-fitness-text"
              />
            </div>
            
            <Button
              onClick={handleManualConnect}
              disabled={actionLoading || !pit || !locationId}
              className="w-full bg-fitness-accent text-black hover:bg-fitness-accent-dark"
            >
              {actionLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
              ) : (
                'Connect Manually'
              )}
            </Button>
          </TabsContent>
        </Tabs>
      )}
      
      {integration.status === 'connected' && (
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
      )}
      
      {integration.status === 'disconnected' && (
        <Button
          onClick={handleOAuth}
          disabled={actionLoading}
          className="bg-fitness-accent text-black hover:bg-fitness-accent-dark"
        >
          {actionLoading ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
          ) : (
            'Reconnect'
          )}
        </Button>
      )}
      
      {error && (
        <div className="mt-4 text-red-400 p-2 bg-red-100/10 border border-red-400 rounded">
          {error}
        </div>
      )}
    </div>
  );
};
