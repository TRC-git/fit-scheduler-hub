
import React, { useState } from 'react';
import { Integration } from './IntegrationCard';
import { ConnectionTabs } from './lead-connector/ConnectionTabs';
import { ConnectedControls } from './lead-connector/ConnectedControls';
import { ReconnectControl } from './lead-connector/ReconnectControl';
import { ErrorDisplay } from './lead-connector/ErrorDisplay';
import { StatusBadge } from './lead-connector/StatusBadge';

interface LeadConnectorIntegrationProps {
  integration: Integration;
}

export const LeadConnectorIntegration: React.FC<LeadConnectorIntegrationProps> = ({ integration }) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div
      className="bg-fitness-card rounded-lg p-6 shadow mb-6 max-w-xl border border-fitness-border"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h3 className="text-xl font-bold text-fitness-text">{integration.name}</h3>
        <StatusBadge status={integration.status} />
      </div>
      
      <div className="mb-6 border-b border-fitness-border pb-4">
        {integration.status === 'connected' && integration.last_synced_at && (
          <div className="text-sm text-fitness-text opacity-80">
            Last synced: {new Date(integration.last_synced_at).toLocaleString()}
          </div>
        )}
      </div>
      
      {integration.status === 'not_connected' && (
        <ConnectionTabs 
          setActionLoading={setActionLoading} 
          setError={setError} 
          actionLoading={actionLoading} 
        />
      )}
      
      {integration.status === 'connected' && (
        <ConnectedControls 
          integration={integration}
          setActionLoading={setActionLoading} 
          setError={setError} 
          actionLoading={actionLoading} 
        />
      )}
      
      {integration.status === 'disconnected' && (
        <ReconnectControl 
          setActionLoading={setActionLoading} 
          setError={setError} 
          actionLoading={actionLoading} 
        />
      )}
      
      <ErrorDisplay error={error} />
    </div>
  );
};
