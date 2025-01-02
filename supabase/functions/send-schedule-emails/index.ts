import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting send-schedule-emails function");
    
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Get all active employees
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('email, firstname, lastname')
      .eq('isactive', true);

    if (employeesError) {
      console.error("Error fetching employees:", employeesError);
      throw employeesError;
    }

    if (!employees || employees.length === 0) {
      console.log("No active employees found");
      return new Response(
        JSON.stringify({ message: "No active employees found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get all schedules for the current week
    const startOfWeek = new Date();
    const endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const { data: schedules, error: schedulesError } = await supabase
      .from('schedules')
      .select(`
        *,
        employees (firstname, lastname),
        positions (positionname),
        businesslocations (address)
      `)
      .gte('shiftdate', startOfWeek.toISOString())
      .lte('shiftdate', endOfWeek.toISOString());

    if (schedulesError) {
      console.error("Error fetching schedules:", schedulesError);
      throw schedulesError;
    }

    console.log(`Found ${employees.length} employees and ${schedules?.length || 0} schedules`);

    // Send email to each employee
    const emailPromises = employees.map(async (employee) => {
      try {
        // Filter schedules for this employee
        const employeeSchedules = schedules?.filter(
          schedule => schedule.employees?.firstname === employee.firstname && 
                     schedule.employees?.lastname === employee.lastname
        ) || [];

        // Create HTML for employee's schedule
        const scheduleHtml = employeeSchedules.map(schedule => `
          <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;">
            <h3>Date: ${new Date(schedule.shiftdate).toLocaleDateString()}</h3>
            <p>Time: ${schedule.starttime} - ${schedule.endtime}</p>
            <p>Position: ${schedule.positions?.positionname || 'N/A'}</p>
            <p>Location: ${schedule.businesslocations?.address || 'N/A'}</p>
            ${schedule.notes ? `<p>Notes: ${schedule.notes}</p>` : ''}
          </div>
        `).join('');

        console.log(`Sending email to ${employee.email}`);

        // Send email using Resend
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Schedule System <onboarding@resend.dev>",
            to: [employee.email],
            subject: "Your Updated Schedule",
            html: `
              <h2>Hello ${employee.firstname},</h2>
              ${employeeSchedules.length > 0 
                ? `<p>Here is your updated schedule for the upcoming week:</p>${scheduleHtml}`
                : `<p>You have no scheduled shifts for the upcoming week.</p>`
              }
              <p>Please review your schedule and contact your manager if you have any questions.</p>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.text();
          throw new Error(`Failed to send email: ${errorData}`);
        }

        const responseData = await emailResponse.json();
        console.log(`Successfully sent email to ${employee.email}:`, responseData);
        return responseData;

      } catch (error) {
        console.error(`Error sending email to ${employee.email}:`, error);
        throw new Error(`Failed to send email to ${employee.email}: ${error.message}`);
      }
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ message: "Schedules sent successfully" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Error in send-schedule-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});