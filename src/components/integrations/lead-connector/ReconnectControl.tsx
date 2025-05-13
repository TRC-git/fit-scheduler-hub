
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { initiateOAuth } from '@/integrations/apis/integrationsApi';
import { useToast } from '@/hooks/use-toast';

interface ReconnectControlProps {
  setActionLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  actionLoading: boolean;
}

export const ReconnectControl: React.FC<ReconnectControlProps> = ({ 
  setActionLoading,
  setError,
  actionLoading
}) => {
  const { toast } = useToast();

  const handleReconnect = async () => {
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
    <Button
      onClick={handleReconnect}
      disabled={actionLoading}
      className="bg-fitness-accent text-black hover:bg-fitness-accent-dark"
    >
      {actionLoading ? (
        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
      ) : (
        'Reconnect'
      )}
    </Button>
  );
};
