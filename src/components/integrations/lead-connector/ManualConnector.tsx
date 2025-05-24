import React from 'react';
import { Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { manualConnect } from '@/integrations/apis/integrationsApi';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface ManualConnectorProps {
  setActionLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  actionLoading: boolean;
}

export const ManualConnector: React.FC<ManualConnectorProps> = ({
  setActionLoading,
  setError,
  actionLoading,
}) => {
  const [pit, setPit] = React.useState('');
  const [locationId, setLocationId] = React.useState('');
  const { toast } = useToast();

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

  return (
    <div className="space-y-4">
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
          className="w-full bg-fitness-inner text-fitness-text border-fitness-muted"
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
          className="w-full bg-fitness-inner text-fitness-text border-fitness-muted"
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
    </div>
  );
};
