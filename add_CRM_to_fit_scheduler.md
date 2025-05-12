**Product Requirements Document: Integrations Section Enhancement**


**1. Overview**


This document outlines the requirements for redesigning the Integrations section of the FitScheduler System for The Rep Connect, platform to provide a more visually appealing and user-friendly interface using integration cards. It also details the implementation plan for the first functional integration: LeadConnector (GoHighLevel), supporting both OAuth V2 and manual (Private Integration Token + Location ID) connection methods, with UI states for configuration, connection status, and manual syncing. Other integrations will be initially displayed as "Coming Soon".


**2. Goals**


*   Implement a fully functional integration for LeadConnector (GoHighLevel - never mention Highlevel, as it's not whitelabel friendly), supporting both OAuth V2 and Manual connection methods.
*   Provide a clear user flow for configuring and connecting the LeadConnector integration.
*   Display the connection status (Connected/Disconnected/Configure), last sync time, and a "Sync Again" action for the connected LeadConnector integration.
*   Securely store integration credentials (OAuth tokens, PIT, Location ID) in the backend.
*   Lay the technical foundation for future integrations using the database structure and edge functions.
*   Create the necessary "POS" app in the GoHighLevel Developer Marketplace and configure required settings like Redirect URIs.


**3. Non-Goals**


*   Implementing full data synchronization (beyond a simple test like contact count) for LeadConnector in this phase.
*   Implementing full connection flows or data synchronization for any "Coming Soon" integrations.
*   Implementing webhook handling (for receiving events) *for this specific feature*. Webhooks are mentioned in the GH docs, but this PRD focuses on the connection and sync *initiation* from POS.
*   Automated synchronization scheduling for LeadConnector.


**4. Target Audience**


POS platform users who wish to connect their account with external services like CRMs, marketing automation tools, or gym management software to enhance their workflow and data management.


**5. Functional Requirements**


**5.1. Integrations Section UI (Screenshot 1 Reference)**


*   The "Integrations" tab in the top navigation should display a new layout.
*   The main content area should feature integration options presented as visual cards.
*   Each integration card should display:
    *   Integration Name (e.g., LeadConnector, Salesforce, Zapier)
    *   Integration Icon
    *   A brief description or status indicator.
*   The following integrations will be listed:
    *   **CRM:** LeadConnector (GoHighLevel), Salesforce, Hubspot
    *   **API Tools:** Zapier, Make
*   All integration cards, *except* LeadConnector, should display a "Coming Soon" indicator prominently. The card might be greyed out or have an overlay.
*   The LeadConnector card's appearance and action button will be dynamic based on its connection status for the current user/location.


**5.2. LeadConnector (GoHighLevel) Integration**


*   **States:** The LeadConnector card will have at least three primary states:
    *   **Configure:** Shown when the user/location has not yet connected the LeadConnector integration.
        *   Card displays "LeadConnector", icon, a brief description (e.g., "Connect your GoHighLevel account"), and a prominent "Connect" button.
    *   **Connecting:** A temporary state while the connection process is underway (e.g., after initiating OAuth redirect or submitting manual credentials). Could involve a loading indicator.
    *   **Connected:** Shown when the user/location has successfully connected the LeadConnector integration. (Screenshot 2 Reference)
        *   Card displays "LeadConnector", icon, status "Connected" (in a success color like green), "Last Synced" timestamp, a basic count (e.g., "Contacts Synced: X"), and a "Sync Again" button.
        *   A secondary action button (e.g., gear icon) should be available to manage the connection (e.g., Reconfigure, Disconnect).
    *   **Error/Disconnected:** Shown if a previous connection attempt failed or if the connection is broken (e.g., token expired and refresh failed, manual credentials invalid).
        *   Card displays "LeadConnector", icon, status "Disconnected" or "Error" (in a warning/error color), a brief error message (if available), and a "Reconnect" or "Configure" button.


*   **Connection Flow (Clicking "Connect" or "Configure"):**
    *   Clicking the "Connect" or "Configure" button on the LeadConnector card will open a modal or navigate to a dedicated connection page.
    *   This interface will present the user with two distinct connection options:
        *   "Connect via OAuth (Recommended)"
        *   "Manual Connection (using PIT + Location ID)"


*   **OAuth V2 Connection Method:**
    *   *Initiation:* The user clicks the "Connect via OAuth" option. The backend will initiate the GoHighLevel OAuth V2 flow.
    *   The user will be redirected to the GoHighLevel authorization URL (using the stored `Client ID` and a configured `Redirect URI`). This URI *must* be registered in the "Point Of Sale" GoHighLevel Marketplace app settings.
    *   *Authorization Grant:* The user logs into GoHighLevel (if not already) and is prompted to authorize the TRACI application to access their data based on the requested `scopes`.
    *   *Callback Handling:* Upon successful authorization, GoHighLevel redirects the user back to the TRACI `Redirect URI` with an `authorization code` appended as a query parameter.
    *   The TRACI backend (specifically, the endpoint configured as the `Redirect URI`) must capture this `code`.
    *   *Token Exchange:* The TRACI backend makes a secure POST request to the GoHighLevel token endpoint (`https://services.leadconnectorhq.com/oauth/token`) exchanging the `authorization code` for an `access_token` and a `refresh_token`, including the `Client ID` and `Client Secret`. (Reference: provided GoHighLevel OAuth docs)
    *   *Secure Storage:* The `access_token`, `refresh_token`, token `type`, and `expires_in` should be securely stored in the database associated with the user/location.
    *   *Connection Test:* Immediately after obtaining tokens, the backend should perform a simple test API call to GoHighLevel (e.g., fetching contact count for the location) using the `access_token` to verify the connection is valid and the scopes grant necessary permissions.
    *   *Status Update:* Update the LeadConnector card state to "Connected" and display the success status, last synced time (current time), and the count obtained from the test.
    *   *Error Handling:* If any step fails (redirection error, token exchange error, test API call error), update the card state to "Error/Disconnected" and potentially display a user-friendly error message.


*   **Manual Connection Method:**
    *   *Input Form:* The user clicks the "Manual Connection" option. A form is displayed asking for:
        *   Private Integration Token (PIT) - Input field.
        *   Location ID - Input field.
    *   Provide clear instructions or links on where to find the PIT and Location ID within GoHighLevel.
    *   A "Connect" button to submit the form.
    *   *Secure Storage:* Upon submission, the PIT and Location ID should be securely stored in the database associated with the user/location.
    *   *Connection Test:* The backend performs a test API call to GoHighLevel (e.g., fetching contact count for the location) using the provided PIT and Location ID to verify the credentials are valid and grant necessary permissions.
    *   *Status Update:* Update the LeadConnector card state to "Connected" and display the success status, last synced time (current time), and the count obtained from the test.
    *   *Error Handling:* If the test API call fails (invalid credentials), update the card state to "Error/Disconnected", display an error message, and do *not* save the invalid credentials permanently (or mark them as invalid).


*   **Connected State Actions:**
    *   *Sync Again Button:* Clicking this button triggers the backend to perform the test API call again (counting contacts) and update the "Last Synced" timestamp and contact count displayed on the card.
    *   *Configure/Disconnect (via Gear Icon):* Clicking this icon (or a similar control) could open a modal allowing the user to:
        *   View connection details (without revealing full tokens/secrets).
        *   Initiate Reconnection (useful if connection status changes to Error).
        *   Disconnect the integration (deletes stored credentials for this user/location).


**6. Technical Requirements**


*   **Backend:**
    *   Requires API endpoints to support the frontend UI and connection processes.
    *   Endpoints needed:
        *   `GET /integrations`: Fetch available integrations and their current status for the logged-in user/location.
        *   `POST /integrations/leadconnector/oauth/initiate`: Initiate OAuth redirect URL.
        *   `GET /integrations/leadconnector/oauth/callback`: Handle the OAuth redirect from GoHighLevel, exchange code for tokens, perform test sync, store credentials. **This endpoint's URL must exactly match the Redirect URI configured in the GoHighLevel Developer Marketplace app settings.**
        *   `POST /integrations/leadconnector/manual/connect`: Receive PIT/Location ID, perform test sync, store credentials.
        *   `POST /integrations/leadconnector/sync`: Trigger manual sync test (contact count).
        *   `DELETE /integrations/leadconnector`: Disconnect the integration (remove stored credentials).
    *   OAuth Token Refresh: Implement logic within the backend GoHighLevel API client to automatically use the `refresh_token` to obtain a new `access_token` when the current one expires before making an API call. The new tokens must be updated in the database.


*   **Database (Supabase - Intended Implementation):**
    *   Create a table, e.g., `user_integrations`, to store integration configurations per user and/or location.
    *   Table schema should include:
        *   `id` (PK)
        *   `user_id` (FK to user)
        *   `location_id` (FK to location, assuming integrations can be location-specific)
        *   `integration_type` (Enum or FK to an `integrations_master` table, e.g., 'leadconnector')
        *   `connection_method` (Enum: 'oauth', 'manual')
        *   `credentials` (JSONB or similar encrypted column): Store sensitive data like `pit`, `location_id`, `oauth_access_token`, `oauth_refresh_token`, `oauth_expires_at`. *Encryption is highly recommended for production.*
        *   `status` (Enum: 'connected', 'disconnected', 'error', 'configuring')
        *   `last_synced_at` (Timestamp)
        *   `synced_data` (JSONB: initially just `{ "contact_count": X }`)
        *   `created_at`
        *   `updated_at`
    *   Supabase secrets or environment variables should be used to store the GoHighLevel `Client ID` and `Client Secret` securely. *Do not store these in the client-side code.*


*   **Backend (Mock Implementation):**
    *   Backend endpoints will simulate successful/failed connection and sync attempts without a database.
    *   Store connection state and mock credentials in memory or simple mock objects.
    *   Return predefined JSON responses that match the expected structure for success/error states, including mock `last_synced_at` and `synced_data`.
    *   The UI should be built against these mock endpoints initially.


*   **GoHighLevel Developer Marketplace:**
    *   A new app named "FitScheduler" must be created in the GoHighLevel Developer Marketplace.
    *   Necessary `scopes` must be selected (initially minimal scopes required for contact read, potentially calendars read, etc., based on the test sync and future plans). (Reference: provided GoHighLevel Scopes docs)
    *   **Configure Redirect URIs:** In the "Redirect URLs" section of the FitScheduler app settings (as shown in the provided image), **add and save the full URL of the TRACI backend endpoint that handles the OAuth callback (`GET /integrations/leadconnector/oauth/callback`).** This URL is where GoHighLevel will redirect the user (and the authorization code) after they successfully authorize the TRACI app. You must include at least one redirect URL before making the app public.
    *   Obtain the `Client ID` and `Client Secret` for the "FitScheduler" app.
    *   Securely store the `Client ID` and `Client Secret` in the FitScheduler backend environment/secrets manager.


**7. Design Considerations**


*   Use distinct card designs or overlays for "Coming Soon" integrations vs. configurable/connected ones.
*   Clear visual indicators (icons, colors, text) for connection status (Connected, Disconnected, Error, Configuring).
*   The connection modal/page should be easy to follow, clearly explaining the difference between OAuth and Manual connection and providing guidance on where to find manual credentials.
*   Provide user feedback during connection attempts (loading states, success/error messages).
*   The "Connected" card state should clearly present the status, last sync time, and the core action ("Sync Again"). The secondary action (gear icon) should be unobtrusive but accessible.


**8. Implementation Steps (High-Level)**

1.  **Database Setup:** Define and implement the `user_integrations` table schema in Supabase (or design the mock storage). 
    - **Status: Done**
    - `user_integrations` table is now created and ready for use. Database is ready for backend integration.
2.  **GoHighLevel App Creation:** Create the "FitScheduler" app in the GH Developer Marketplace, select necessary scopes, **configure the Redirect URI(s)**, and obtain Client ID/Secret. Store these securely in the backend environment. - **Status: Done**
    - App is created and credentials are securely stored. Ready for backend integration.
3.  **Backend Endpoints (Mock/Real):** Develop the API endpoints (`GET /integrations`, `POST /integrations/leadconnector/...`, `DELETE /integrations/leadconnector`) based on the chosen implementation approach (mock first, then replace with Supabase/Edge Functions). Implement the OAuth token exchange and refresh logic. Implement the test sync (contact count API call). - **Status: In Progress**
    - Backend implementation is starting.
4.  **Frontend UI:** Build the Integrations page with card components. Implement the card layout, categories, and "Coming Soon" states. - **Status: To Do**
5.  **LeadConnector Card UI:** Implement the dynamic states ("Configure", "Connected", "Error") for the LeadConnector card. Build the connection modal/page with OAuth and Manual options and their respective forms/flows. - **Status: To Do**
6.  **Connect Backend and Frontend:** Integrate the frontend UI with the backend API endpoints to fetch data, initiate connections, and trigger syncs. - **Status: To Do**
7.  **Secure Credential Handling:** Ensure all sensitive data (Client ID, Secret, Tokens, PIT, Location ID) is handled and stored securely, especially when moving from mock to real implementation. - **Status: To Do**
8.  **Testing:** Test both OAuth and Manual connection flows end-to-end, including success, error, and token refresh scenarios. Test the "Sync Again" action. Test the "Coming Soon" card behavior. - **Status: To Do**


**9. Future Scope**


*   Implementing full data synchronization for LeadConnector (contacts, calendars, opportunities, etc.).
*   Adding configuration options for sync frequency and data types.
*   Implementing webhook reception and processing for real-time updates from GoHighLevel.
*   Implementing connection flows and data synchronization for other listed integrations (Salesforce, Hubspot, Zapier, Make, Gym Tools).
*   Displaying detailed sync logs and error reports.


**10. Appendix**


*   [Image 1: Current Integrations UI] - (Include the first screenshot provided)
*   [Image 2: Desired Connected Card State] - (Include the second screenshot provided)
*   GoHighLevel Developer Marketplace Documentation (OCR provided)
    *   How to get started with the Developer's Marketplace (OCR Pages 1-17)
    *   Glossary of terms (OCR Pages 2, 4-6)
    *   What is the OAuth Flow in the Developer's Marketplace? (OCR Pages 6-7)
    *   Usage Cases (OCR Page 8)
    *   How to use the oAuth V2 to configure Webhooks for your apps? (OCR Pages 9-14)
    *   FAQ (OCR Pages 15-17)
    *   Specifically referenced GH docs links (as found in OCR):
        *   Developer Support: `https://developers.gohighlevel.com/support`
        *   GoHighLevel Website: [Not directly needed for dev, but referenced]
        *   GoHighLevel Developer Documentation: [General link]
        *   Understanding Access Tokens: [Link from doc]
        *   OAuth 2.0 Introduction: [Link from doc]
        *   OAuth 2.0 Redirect URI: [Link from doc]
        *   OAuth 2.0 Authorization Code Grant: [Link from doc]
        *   OAuth 2.0 Scopes: [Link from doc, specifically the internal stoplight.io link: `https://highlevel.stoplight.io/docs/integrations/6444956c5219f-scopes`]
        *   Gohighlevel's OAuth Scopes: [Reference to the stoplight.io link]
        *   HTTP Status Codes: [Link from doc]
        *   Understand the Authorization Header: [Link from doc]
        *   Learn more about Callback URLs: [Link from doc]
        *   Introduction to JSON: [Link from doc]
        *   Understanding API Parameters: [Link from doc]
        *   Implementing Pagination in APIs: [Link from doc]
        *   HTTP Request Methods: [Link from doc]
        *   HTTP Response Status Codes: [Link from doc]
        *   GET method in HTTP: [Link from doc]
        *   POST method in HTTP: [Link from doc]
        *   PUT method in HTTP: [Link from doc]
        *   DELETE method in HTTP: [Link from doc]
        *   Getting Access Token (Specific guide): `https://highlevel.stoplight.io/docs/integrations/00d0c0ecaa369-get-access-token`
        *   Webhook Verification Test URL (Example from doc): `https://services.leadconnectorhq.com/oauth/token`


**Implementation Notes**

* GoHighLevel `Client ID`