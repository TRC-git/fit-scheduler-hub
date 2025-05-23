import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, RefreshCw, Calendar, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { syncUsersAndCalendars } from "@/integrations/apis/integrationsApi";
import { useState } from "react";

interface SyncedUser {
  id: number;
  ghl_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: string | null;
  is_active: boolean;
  synced_at: string;
}

interface SyncedCalendar {
  id: number;
  ghl_calendar_id: string;
  calendar_name: string;
  calendar_type: string | null;
  is_active: boolean;
  synced_at: string;
}

const SyncedUsersSettings = () => {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);

  // Fetch synced users
  const { data: syncedUsers, isLoading: loadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['syncedUsers'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      
      const { data, error } = await supabase
        .from('ghl_synced_users')
        .select('*')
        .eq('user_id', user.id)
        .order('synced_at', { ascending: false });
      
      if (error) throw error;
      return data as SyncedUser[];
    }
  });

  // Fetch synced calendars
  const { data: syncedCalendars, isLoading: loadingCalendars, refetch: refetchCalendars } = useQuery({
    queryKey: ['syncedCalendars'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      
      const { data, error } = await supabase
        .from('ghl_synced_calendars')
        .select('*')
        .eq('user_id', user.id)
        .order('synced_at', { ascending: false });
      
      if (error) throw error;
      return data as SyncedCalendar[];
    }
  });

  // Check if LeadConnector is connected
  const { data: integration } = useQuery({
    queryKey: ['leadConnectorIntegration'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');
      
      const { data, error } = await supabase
        .from('user_integrations')
        .select('*')
        .eq('user_id', user.id)
        .eq('integration_type', 'leadconnector')
        .single();
      
      if (error) return null;
      return data;
    }
  });

  const handleSync = async () => {
    if (!integration || integration.status !== 'connected') {
      toast({
        title: "LeadConnector Not Connected",
        description: "Please connect your LeadConnector integration first in the Integrations tab.",
        variant: "destructive",
      });
      return;
    }

    setSyncing(true);
    try {
      await syncUsersAndCalendars();
      await refetchUsers();
      await refetchCalendars();
      
      toast({
        title: "Sync Successful",
        description: "Users and calendars have been synced from GoHighLevel successfully.",
      });
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync users and calendars. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const isLoading = loadingUsers || loadingCalendars;
  const isConnected = integration?.status === 'connected';

  return (
    <div className="space-y-6">
      {/* Sync Controls */}
      <Card className="bg-fitness-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-fitness-text flex items-center gap-2">
              <Users className="w-5 h-5 text-fitness-accent" />
              GoHighLevel Users & Calendars
            </CardTitle>
            <Button
              onClick={handleSync}
              disabled={syncing || !isConnected}
              className="bg-fitness-accent text-black hover:bg-fitness-accent-dark"
            >
              {syncing ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Syncing...</>
              ) : (
                <><RefreshCw className="h-4 w-4 mr-2" /> Sync Now</>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!isConnected && (
            <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-md mb-4">
              <p className="text-sm">
                LeadConnector integration is not connected. Go to the Integrations tab to connect your GoHighLevel account first.
              </p>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Sync users and calendars from your GoHighLevel location to view team information and availability.
          </p>
        </CardContent>
      </Card>

      {/* Synced Users */}
      <Card className="bg-fitness-card">
        <CardHeader>
          <CardTitle className="text-fitness-text flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-fitness-accent" />
            Synced Users ({syncedUsers?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-fitness-accent" />
              <span className="ml-2 text-fitness-text">Loading synced users...</span>
            </div>
          ) : syncedUsers && syncedUsers.length > 0 ? (
            <div className="space-y-3">
              {syncedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-fitness-background rounded-lg border border-fitness-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-fitness-accent/20 flex items-center justify-center">
                      <span className="text-fitness-accent font-medium">
                        {user.first_name?.[0] || user.email[0].toUpperCase()}
                        {user.last_name?.[0] || ''}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-fitness-text">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}`
                          : user.email
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email} {user.phone && ` • ${user.phone}`}
                      </div>
                      {user.role && (
                        <div className="text-xs text-fitness-accent">
                          {user.role}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      user.is_active 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Synced: {new Date(user.synced_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No users synced yet</p>
              <p className="text-sm">Click "Sync Now" to fetch users from GoHighLevel</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Synced Calendars */}
      <Card className="bg-fitness-card">
        <CardHeader>
          <CardTitle className="text-fitness-text flex items-center gap-2">
            <Calendar className="w-5 h-5 text-fitness-accent" />
            Synced Calendars ({syncedCalendars?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-fitness-accent" />
              <span className="ml-2 text-fitness-text">Loading synced calendars...</span>
            </div>
          ) : syncedCalendars && syncedCalendars.length > 0 ? (
            <div className="space-y-3">
              {syncedCalendars.map((calendar) => (
                <div
                  key={calendar.id}
                  className="flex items-center justify-between p-3 bg-fitness-background rounded-lg border border-fitness-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-fitness-accent/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-fitness-accent" />
                    </div>
                    <div>
                      <div className="font-medium text-fitness-text">
                        {calendar.calendar_name}
                      </div>
                      {calendar.calendar_type && (
                        <div className="text-sm text-muted-foreground">
                          Type: {calendar.calendar_type}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      calendar.is_active 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {calendar.is_active ? 'Active' : 'Inactive'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Synced: {new Date(calendar.synced_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No calendars synced yet</p>
              <p className="text-sm">Click "Sync Now" to fetch calendars from GoHighLevel</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SyncedUsersSettings; 