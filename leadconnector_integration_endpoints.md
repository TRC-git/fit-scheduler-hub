# LeadConnector Integration Endpoints Documentation

## Overview
Your application has a comprehensive LeadConnector (GoHighLevel whitelabel) integration that supports both OAuth and manual connection methods. The integration allows pulling connected location users and their calendars from app.therepconnect.co.

## Base Configuration
- **Base API URL**: `/.netlify/functions`
- **GoHighLevel API Base**: `https://services.leadconnectorhq.com`
- **API Version**: `2021-07-28`

## Authentication Methods

### 1. OAuth Connection
- **Endpoint**: `POST /.netlify/functions/oauth-initiate`
- **Purpose**: Initiates OAuth flow for connecting to LeadConnector
- **Redirect URL**: `/.netlify/functions/oauth-callback`

### 2. Manual Connection
- **Endpoint**: `POST /.netlify/functions/manual-connect`
- **Purpose**: Connect using Private Integration Token (PIT) + Location ID
- **Required Fields**:
  - `pit`: Private Integration Token
  - `location_id`: GoHighLevel Location ID

## Core Integration Endpoints

### 1. Get Integration Status
- **Endpoint**: `GET /.netlify/functions/get-integrations`
- **Purpose**: Retrieve connection status and synced data for all integrations
- **Response**: Returns LeadConnector status, sync data, and last sync timestamp

### 2. Sync Users and Calendars (Primary Endpoint for Your Use Case)
- **Endpoint**: `POST /.netlify/functions/sync-users-calendars`
- **Purpose**: **Main endpoint for pulling connected location users and calendars**
- **Functionality**:
  - Fetches users from `https://services.leadconnectorhq.com/v1/users/search?locationId={locationId}`
  - Fetches calendars from `https://services.leadconnectorhq.com/v1/calendars/?locationId={locationId}`
  - Syncs user availability data from calendar team members
  - Stores all data in database tables

### 3. Basic Sync (Contact Count)
- **Endpoint**: `POST /.netlify/functions/sync`
- **Purpose**: Simple sync that fetches contact count for validation
- **GoHighLevel API**: `/v1/contacts/count`

### 4. Disconnect Integration
- **Endpoint**: `DELETE /.netlify/functions/disconnect`
- **Purpose**: Remove LeadConnector integration and credentials

## Data Storage Structure

### Users Table (`ghl_synced_users`)
Stores synchronized users from GoHighLevel:
- `ghl_user_id`: GoHighLevel user ID
- `ghl_location_id`: GoHighLevel location ID
- `email`, `first_name`, `last_name`, `phone`
- `role`: User role/type in GoHighLevel
- `permissions`: JSONB of user permissions
- `is_active`: User status

### Calendars Table (`ghl_synced_calendars`)
Stores synchronized calendars from GoHighLevel:
- `ghl_calendar_id`: GoHighLevel calendar ID
- `ghl_location_id`: GoHighLevel location ID
- `calendar_name`, `calendar_type`, `description`
- `timezone`: Calendar timezone
- `team_members`: JSONB array of team member data
- `settings`: JSONB of calendar configuration (availability, buffers, etc.)

### User Availability Table (`ghl_user_availability`)
Stores detailed availability for users:
- `ghl_user_id`: GoHighLevel user ID
- `ghl_calendar_id`: Associated calendar ID
- `day_of_week`: 0-6 (Sunday-Saturday)
- `start_time`, `end_time`: Available time slots
- `timezone`: Availability timezone

## Frontend Integration Points

### Client-Side API Calls
Located in `src/integrations/apis/integrationsApi.ts`:

```typescript
// Get integration status
getIntegrations()

// Initiate OAuth connection
initiateOAuth()

// Manual connection with PIT
manualConnect(pit: string, locationId: string)

// Sync users and calendars (main function for your use case)
syncUsersAndCalendars()

// Basic sync
syncLeadConnector()

// Disconnect integration
disconnectLeadConnector()
```

### UI Components
- **Integration Management**: `src/components/integrations/LeadConnectorIntegration.tsx`
- **User Display**: `src/components/staff/SyncedStaffList.tsx`
- **Settings Panel**: `src/components/settings/SyncedUsersSettings.tsx`

## Key Features for Your Use Case

### 1. Pull Connected Location Users
The `sync-users-calendars` endpoint:
- Fetches all users from the connected GoHighLevel location
- Stores user details including email, name, phone, role
- Captures user permissions and active status
- Supports both OAuth and manual connection methods

### 2. Pull User Calendars
The same endpoint also:
- Fetches all calendars associated with the location
- Captures calendar settings, timezones, and team assignments
- Extracts individual user availability from calendar team members
- Stores detailed time slots for each user/calendar combination

### 3. Data Access Patterns
- All data is scoped to the authenticated user (`user_id`)
- Row-level security ensures users only see their own synced data
- Real-time status updates via integration status tracking
- Last sync timestamps for data freshness verification

## Usage Example

To pull users and calendars for a connected location:

1. **Check Connection Status**:
   ```javascript
   const integrations = await getIntegrations();
   const leadConnector = integrations.find(i => i.type === 'leadconnector');
   ```

2. **Sync Users and Calendars**:
   ```javascript
   if (leadConnector.status === 'connected') {
     const result = await syncUsersAndCalendars();
     // Result includes sync counts and any errors
   }
   ```

3. **Access Synced Data**:
   Query the Supabase tables directly:
   - `ghl_synced_users` for user information
   - `ghl_synced_calendars` for calendar details
   - `ghl_user_availability` for specific time slots

## Security & Authentication
- All endpoints require Supabase JWT authentication
- Row-level security on all data tables
- Credentials stored securely in `user_integrations` table
- CORS headers configured for cross-origin requests
- Token validation against GoHighLevel API before storage

This integration provides a complete solution for pulling and managing connected location users and their calendar data from your GoHighLevel whitelabel instance.