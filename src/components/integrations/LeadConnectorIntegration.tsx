
import React, { useState } from 'react';
import { Integration } from './IntegrationCard';
import { ConnectionTabs } from './lead-connector/ConnectionTabs';
import { ConnectedControls } from './lead-connector/ConnectedControls';
import { ReconnectControl } from './lead-connector/ReconnectControl';

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
      <h3 className="text-xl font-bold text-fitness-text mb-2">{integration.name}</h3>
      <div className="mb-4 text-fitness-text">
        Status: <span className={`font-semibold ${integration.status === 'connected' ? 'text-green-400' : 'text-amber-400'}`}>
          {integration.status}
        </span>
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
      
      {error && (
        <div className="mt-4 text-red-400 p-2 bg-red-100/10 border border-red-400 rounded">
          {error}
        </div>
      )}
    </div>
  );
};
