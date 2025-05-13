
import React from 'react';
import { Loader2 } from 'lucide-react';

export type Integration = {
  name: string;
  type: string;
  status: string;
  synced_data?: { contact_count?: number };
  last_synced_at?: string;
};

type IntegrationCardProps = {
  integration: Integration;
  actionLoading: boolean;
  onOAuth: () => void;
  onSync: () => void;
  onDisconnect: () => void;
  onManualConnect: (pit: string, locationId: string) => void;
};

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  actionLoading,
  onOAuth,
  onSync,
  onDisconnect,
  onManualConnect,
}) => {
  const [pit, setPit] = React.useState('');
  const [locationId, setLocationId] = React.useState('');

  return (
    <div
      key={integration.type}
      className="bg-fitness-card rounded-lg p-6 shadow mb-6 max-w-xl border border-fitness-border"
    >
      <div className="font-bold text-fitness-text mb-2">{integration.name}</div>
      <div className="mb-2 text-fitness-text">
        Status: <span className={`font-semibold ${integration.status === 'connected' ? 'text-green-400' : ''}`}>
          {integration.status}
        </span>
      </div>
      {integration.type === 'leadconnector' && (
        <>
          {integration.status === 'not_connected' && (
            <>
              <button
                className="bg-fitness-accent text-black px-4 py-2 rounded mr-2 hover:bg-fitness-accent-dark transition disabled:opacity-50"
                onClick={onOAuth}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> Processing...</>
                ) : (
                  'Connect via OAuth'
                )}
              </button>
              <div className="flex flex-col md:flex-row gap-2 mt-2">
                <input
                  className="bg-fitness-input text-fitness-text border border-fitness-border rounded px-2 py-1"
                  type="text"
                  placeholder="PIT"
                  value={pit}
                  onChange={e => setPit(e.target.value)}
                  disabled={actionLoading}
                />
                <input
                  className="bg-fitness-input text-fitness-text border border-fitness-border rounded px-2 py-1"
                  type="text"
                  placeholder="Location ID"
                  value={locationId}
                  onChange={e => setLocationId(e.target.value)}
                  disabled={actionLoading}
                />
                <button
                  className="bg-fitness-accent text-black px-4 py-2 rounded hover:bg-fitness-accent-dark transition disabled:opacity-50"
                  onClick={() => onManualConnect(pit, locationId)}
                  disabled={actionLoading || !pit || !locationId}
                >
                  {actionLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> Processing...</>
                  ) : (
                    'Connect Manually'
                  )}
                </button>
              </div>
            </>
          )}
          {integration.status === 'connected' && (
            <>
              <button
                className="bg-fitness-accent text-black px-4 py-2 rounded mr-2 hover:bg-fitness-accent-dark transition disabled:opacity-50"
                onClick={onSync}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> Processing...</>
                ) : (
                  'Sync Again'
                )}
              </button>
              <button
                className="bg-fitness-danger text-white px-4 py-2 rounded hover:bg-fitness-danger-dark transition disabled:opacity-50"
                onClick={onDisconnect}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> Processing...</>
                ) : (
                  'Disconnect'
                )}
              </button>
              {integration.synced_data && (
                <div className="mt-2 text-fitness-text">
                  Contacts Synced: {integration.synced_data.contact_count || 0}
                </div>
              )}
              <div className="text-fitness-text">
                Last Synced: {integration.last_synced_at ? new Date(integration.last_synced_at).toLocaleString() : 'Never'}
              </div>
            </>
          )}
          {integration.status === 'disconnected' && (
            <button
              className="bg-fitness-accent text-black px-4 py-2 rounded hover:bg-fitness-accent-dark transition disabled:opacity-50"
              onClick={onOAuth}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> Processing...</>
              ) : (
                'Reconnect'
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};
