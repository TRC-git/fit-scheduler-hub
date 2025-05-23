import React from 'react';
import { LeadConnectorIntegration } from './LeadConnectorIntegration';

export type Integration = {
  name: string;
  type: string;
  status: 'connected' | 'not_connected' | 'disconnected';
  synced_data?: { 
    contact_count?: number;
    users_count?: number;
    calendars_count?: number;
    availability_count?: number;
  };
  last_synced_at?: string;
};

export type IntegrationCardProps = {
  integration: Integration;
};

const IntegrationCard: React.FC<IntegrationCardProps> = ({ integration }) => {
  if (integration.type === 'leadconnector') {
    return <LeadConnectorIntegration integration={integration} />;
  }
  
  return (
    <div className="bg-fitness-card rounded-lg p-6 shadow mb-6 max-w-xl border border-fitness-border">
      <h3 className="text-xl font-bold text-fitness-text mb-4">{integration.name}</h3>
      <p className="text-fitness-text">Integration type: {integration.type}</p>
      <p className="text-fitness-text">Status: {integration.status}</p>
    </div>
  );
};

export default IntegrationCard;
