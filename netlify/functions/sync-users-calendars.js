const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const { verifySupabaseJwt } = require('./verifySupabaseJwt');
const localCredentials = require('./localCredentials');

// Add CORS headers for local development
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  // Add CORS headers to all responses
  const headers = { ...corsHeaders };

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Authenticate user using Supabase JWT
  const userId = verifySupabaseJwt(event.headers.authorization);
  if (!userId) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  // Connect to Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL || localCredentials.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || localCredentials.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Get the user's LeadConnector integration
    const { data: integration, error: integrationError } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('integration_type', 'leadconnector')
      .single();

    if (integrationError || !integration) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'LeadConnector integration not found' }),
      };
    }

    if (integration.status !== 'connected') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'LeadConnector integration not connected' }),
      };
    }

    let accessToken, locationId, pit;
    if (integration.connection_method === 'oauth') {
      accessToken = integration.credentials.access_token;
      locationId = integration.credentials.location_id || integration.location_id;
    } else if (integration.connection_method === 'manual') {
      pit = integration.credentials.pit;
      locationId = integration.credentials.location_id || integration.location_id;
    }

    const authHeader = accessToken ? `Bearer ${accessToken}` : `Bearer ${pit}`;
    const apiHeaders = {
      'Authorization': authHeader,
      'Version': '2021-07-28',
      'Content-Type': 'application/json'
    };

    // Initialize sync results
    const syncResults = {
      users: { synced: 0, errors: 0 },
      calendars: { synced: 0, errors: 0 },
      availability: { synced: 0, errors: 0 }
    };

    // 1. Sync Users from GoHighLevel
    console.log('Fetching users from GoHighLevel...');
    
    try {
      // Use the search users endpoint to get all users
      const usersResponse = await fetch(`https://services.leadconnectorhq.com/v1/users/search?locationId=${locationId}`, {
        headers: apiHeaders
      });

      if (!usersResponse.ok) {
        throw new Error(`Users API responded with status: ${usersResponse.status}`);
      }

      const usersData = await usersResponse.json();
      console.log('Users data received:', usersData);

      if (usersData.users && Array.isArray(usersData.users)) {
        for (const user of usersData.users) {
          try {
            // Upsert user into ghl_synced_users table
            const { error: userError } = await supabase
              .from('ghl_synced_users')
              .upsert([{
                user_id: userId,
                ghl_user_id: user.id,
                ghl_location_id: locationId,
                email: user.email,
                first_name: user.firstName,
                last_name: user.lastName,
                phone: user.phone,
                role: user.type || user.role,
                permissions: user.permissions || {},
                is_active: user.deleted !== true,
                updated_at: new Date().toISOString(),
                synced_at: new Date().toISOString(),
              }], { 
                onConflict: ['user_id', 'ghl_user_id', 'ghl_location_id'],
                ignoreDuplicates: false 
              });

            if (userError) {
              console.error('Error syncing user:', user.id, userError);
              syncResults.users.errors++;
            } else {
              syncResults.users.synced++;
            }
          } catch (error) {
            console.error('Error processing user:', user.id, error);
            syncResults.users.errors++;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      syncResults.users.errors++;
    }

    // 2. Sync Calendars from GoHighLevel
    console.log('Fetching calendars from GoHighLevel...');
    
    try {
      const calendarsResponse = await fetch(`https://services.leadconnectorhq.com/v1/calendars/?locationId=${locationId}`, {
        headers: apiHeaders
      });

      if (!calendarsResponse.ok) {
        throw new Error(`Calendars API responded with status: ${calendarsResponse.status}`);
      }

      const calendarsData = await calendarsResponse.json();
      console.log('Calendars data received:', calendarsData);

      if (calendarsData.calendars && Array.isArray(calendarsData.calendars)) {
        for (const calendar of calendarsData.calendars) {
          try {
            // Upsert calendar into ghl_synced_calendars table
            const { error: calendarError } = await supabase
              .from('ghl_synced_calendars')
              .upsert([{
                user_id: userId,
                ghl_calendar_id: calendar.id,
                ghl_location_id: locationId,
                calendar_name: calendar.name,
                calendar_type: calendar.calendarType,
                description: calendar.description,
                timezone: calendar.timezone,
                is_active: calendar.isActive !== false,
                team_members: calendar.teamMembers || [],
                settings: {
                  availability: calendar.availability || {},
                  eventType: calendar.eventType,
                  slotDuration: calendar.slotDuration,
                  slotInterval: calendar.slotInterval,
                  slotBuffer: calendar.slotBuffer,
                  enableRecurring: calendar.enableRecurring,
                  recurring: calendar.recurring || {}
                },
                updated_at: new Date().toISOString(),
                synced_at: new Date().toISOString(),
              }], { 
                onConflict: ['user_id', 'ghl_calendar_id', 'ghl_location_id'],
                ignoreDuplicates: false 
              });

            if (calendarError) {
              console.error('Error syncing calendar:', calendar.id, calendarError);
              syncResults.calendars.errors++;
            } else {
              syncResults.calendars.synced++;

              // 3. Sync user availability for this calendar
              if (calendar.teamMembers && Array.isArray(calendar.teamMembers)) {
                for (const teamMember of calendar.teamMembers) {
                  if (teamMember.userId && teamMember.availability) {
                    try {
                      // Parse availability data and store it
                      const availability = teamMember.availability;
                      
                      // Clear existing availability for this user/calendar combination
                      await supabase
                        .from('ghl_user_availability')
                        .delete()
                        .eq('user_id', userId)
                        .eq('ghl_user_id', teamMember.userId)
                        .eq('ghl_calendar_id', calendar.id)
                        .eq('ghl_location_id', locationId);

                      // Insert new availability data
                      if (availability.hours && Array.isArray(availability.hours)) {
                        for (const dayAvailability of availability.hours) {
                          if (dayAvailability.openTime && dayAvailability.closeTime) {
                            const { error: availabilityError } = await supabase
                              .from('ghl_user_availability')
                              .insert([{
                                user_id: userId,
                                ghl_user_id: teamMember.userId,
                                ghl_calendar_id: calendar.id,
                                ghl_location_id: locationId,
                                day_of_week: dayAvailability.daysOfTheWeek || 0,
                                start_time: dayAvailability.openTime,
                                end_time: dayAvailability.closeTime,
                                timezone: availability.timezone || calendar.timezone,
                                is_available: dayAvailability.open !== false,
                                updated_at: new Date().toISOString(),
                                synced_at: new Date().toISOString(),
                              }]);

                            if (availabilityError) {
                              console.error('Error syncing availability:', availabilityError);
                              syncResults.availability.errors++;
                            } else {
                              syncResults.availability.synced++;
                            }
                          }
                        }
                      }
                    } catch (error) {
                      console.error('Error processing availability for user:', teamMember.userId, error);
                      syncResults.availability.errors++;
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.error('Error processing calendar:', calendar.id, error);
            syncResults.calendars.errors++;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching calendars:', error);
      syncResults.calendars.errors++;
    }

    // Update the integration record with last sync time and results
    const { error: updateError } = await supabase
      .from('user_integrations')
      .update({
        last_synced_at: new Date().toISOString(),
        synced_data: {
          ...integration.synced_data,
          users_count: syncResults.users.synced,
          calendars_count: syncResults.calendars.synced,
          availability_count: syncResults.availability.synced,
          last_sync_results: syncResults
        },
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('integration_type', 'leadconnector');

    if (updateError) {
      console.error('Error updating integration record:', updateError);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Sync completed successfully',
        results: syncResults,
        total_synced: syncResults.users.synced + syncResults.calendars.synced + syncResults.availability.synced,
        total_errors: syncResults.users.errors + syncResults.calendars.errors + syncResults.availability.errors
      }),
    };

  } catch (error) {
    console.error('Unexpected error during sync:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error during sync', 
        details: error.message 
      }),
    };
  }
}; 