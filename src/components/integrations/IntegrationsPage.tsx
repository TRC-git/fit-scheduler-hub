
import React, { useEffect, useState } from 'react';
import { getIntegrations } from '../../integrations/apis/integrationsApi';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Integration } from './IntegrationCard';
import { IntegrationsList } from './IntegrationsList';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { LoadingState } from './LoadingState';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    async function loadIntegrations() {
      setLoading(true);
      setError(null);
      try {
        console.log('Loading integrations...');
        const data = await getIntegrations();
        
        if (data && data.integrations) {
          console.log('Integrations loaded:', data.integrations);
          setIntegrations(data.integrations);
        } else {
          console.warn('Unexpected data format from getIntegrations():', data);
          setError('Invalid data format received from server');
          toast({
            title: "Warning",
            description: "Couldn't load integration data correctly",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error('Failed to load integrations:', err);
        setError('Failed to load integrations. Please try again.');
        toast({
          title: "Error",
          description: "Failed to load integrations",
          variant: "destructive",
        });
        
        // If we've retried less than 3 times and this isn't our initial load,
        // schedule a retry after a delay
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 3000); // 3 second delay
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadIntegrations();
  }, [toast, retryCount]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => setRetryCount(prev => prev + 1)} />;
  }

  if (!integrations.length) {
    return <EmptyState onRefresh={() => setRetryCount(prev => prev + 1)} />;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-fitness-text">Integrations</h2>
      <IntegrationsList integrations={integrations} />
    </div>
  );
}
