
import React from 'react';
import { LeadConnectorIntegration } from './LeadConnectorIntegration';

export type Integration = {
  name: string;
  type: string;
  status: 'connected' | 'not_connected' | 'disconnected';
  synced_data?: { contact_count?: number };
  last_synced_at?: string;
};

type IntegrationCardProps = {
  integration: Integration;
};

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration
}) => {
  if (integration.type === 'leadconnector') {
    return <LeadConnectorIntegration integration={integration} />;
  }
  
  return (
    <div className="bg-fitness-card rounded-lg p-6 shadow mb-6 max-w-xl border border-fitness-border">
      <div className="font-bold text-fitness-text mb-2">{integration.name}</div>
      <div className="mb-2 text-fitness-text">
        Status: <span className={`font-semibold ${integration.status === 'connected' ? 'text-green-400' : ''}`}>
          {integration.status}
        </span>
      </div>
      <div className="text-sm text-muted-foreground">
        This integration type doesn't have a specialized interface yet.
      </div>
    </div>
  );
};
