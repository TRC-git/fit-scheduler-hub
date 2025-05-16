
import React, { useEffect, useState } from 'react';
import { getIntegrations } from '../../integrations/apis/integrationsApi';
import { useToast } from '@/hooks/use-toast';
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
          // Create a default integration as a fallback
          setIntegrations([{
            name: 'LeadConnector',
            type: 'leadconnector',
            status: 'not_connected',
            synced_data: {},
            last_synced_at: null,
          }]);
          toast({
            title: "Notice",
            description: "Using default integration settings - API may not be available",
            variant: "default",
          });
        }
      } catch (err: any) {
        console.error('Failed to load integrations:', err);
        setError(err?.message || "Failed to load integrations");
        // Create a default integration as a fallback
        setIntegrations([{
          name: 'LeadConnector',
          type: 'leadconnector',
          status: 'not_connected',
          synced_data: {},
          last_synced_at: null,
        }]);
        toast({
          title: "API Connection Error",
          description: "Using default integration settings - ensure API endpoints are configured",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadIntegrations();
  }, [toast, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast({
      title: "Retrying",
      description: "Attempting to reconnect to integration services...",
    });
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error && integrations.length === 0) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  // Only show empty state if we explicitly have an empty array and no error
  if (integrations.length === 0 && !error) {
    return <EmptyState onRefresh={handleRetry} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4 text-fitness-text">Integrations</h2>
      <IntegrationsList integrations={integrations} />
    </div>
  );
}
