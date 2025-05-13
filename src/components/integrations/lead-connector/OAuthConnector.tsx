
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { initiateOAuth } from '@/integrations/apis/integrationsApi';
import { useToast } from '@/hooks/use-toast';

interface OAuthConnectorProps {
  setActionLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  actionLoading: boolean;
}

export const OAuthConnector: React.FC<OAuthConnectorProps> = ({
  setActionLoading,
  setError,
  actionLoading,
}) => {
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

  return (
    <>
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
    </>
  );
};
