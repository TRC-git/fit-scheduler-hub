export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      businesslocations: {
        Row: {
          address: string
          business_name: string | null
          closing_time: string
          latitude: number | null
          locationid: number
          logo_url: string | null
          longitude: number | null
          opening_time: string
          operational_days: string[] | null
          phone_number: string | null
          radiusmeters: number | null
          slot_duration: number
          tax_id: string | null
        }
        Insert: {
          address: string
          business_name?: string | null
          closing_time?: string
          latitude?: number | null
          locationid?: number
          logo_url?: string | null
          longitude?: number | null
          opening_time?: string
          operational_days?: string[] | null
          phone_number?: string | null
          radiusmeters?: number | null
          slot_duration?: number
          tax_id?: string | null
        }
        Update: {
          address?: string
          business_name?: string | null
          closing_time?: string
          latitude?: number | null
          locationid?: number
          logo_url?: string | null
          longitude?: number | null
          opening_time?: string
          operational_days?: string[] | null
          phone_number?: string | null
          radiusmeters?: number | null
          slot_duration?: number
          tax_id?: string | null
        }
        Relationships: []
      }
      calendar_access: {
        Row: {
          access_id: number
          calendar_type: string
          can_edit: boolean | null
          can_manage: boolean | null
          can_view: boolean | null
          employeeid: number | null
        }
        Insert: {
          access_id?: number
          calendar_type: string
          can_edit?: boolean | null
          can_manage?: boolean | null
          can_view?: boolean | null
          employeeid?: number | null
        }
        Update: {
          access_id?: number
          calendar_type?: string
          can_edit?: boolean | null
          can_manage?: boolean | null
          can_view?: boolean | null
          employeeid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_access_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      commission_bonus_settings: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          employee_id: number | null
          enabled: boolean | null
          id: number
          performance_bonus_threshold: number | null
          updated_at: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          employee_id?: number | null
          enabled?: boolean | null
          id?: number
          performance_bonus_threshold?: number | null
          updated_at?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          employee_id?: number | null
          enabled?: boolean | null
          id?: number
          performance_bonus_threshold?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_bonus_settings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      compliancelogs: {
        Row: {
          actiontaken: string | null
          complianceid: number
          employeeid: number | null
          ruleviolated: string
          timeentryid: number | null
          violationdate: string | null
        }
        Insert: {
          actiontaken?: string | null
          complianceid?: number
          employeeid?: number | null
          ruleviolated: string
          timeentryid?: number | null
          violationdate?: string | null
        }
        Update: {
          actiontaken?: string | null
          complianceid?: number
          employeeid?: number | null
          ruleviolated?: string
          timeentryid?: number | null
          violationdate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliancelogs_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "compliancelogs_timeentryid_fkey"
            columns: ["timeentryid"]
            isOneToOne: false
            referencedRelation: "timeentries"
            referencedColumns: ["timeentryid"]
          },
        ]
      }
      direct_deposit_info: {
        Row: {
          account_number: string
          account_type: string
          bank_name: string
          created_at: string | null
          employee_id: number | null
          form_file_path: string | null
          id: number
          is_verified: boolean | null
          routing_number: string
        }
        Insert: {
          account_number: string
          account_type: string
          bank_name: string
          created_at?: string | null
          employee_id?: number | null
          form_file_path?: string | null
          id?: number
          is_verified?: boolean | null
          routing_number: string
        }
        Update: {
          account_number?: string
          account_type?: string
          bank_name?: string
          created_at?: string | null
          employee_id?: number | null
          form_file_path?: string | null
          id?: number
          is_verified?: boolean | null
          routing_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_deposit_info_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      employee_deductions: {
        Row: {
          created_at: string | null
          employee_id: number | null
          health_insurance_amount: number | null
          health_insurance_enabled: boolean | null
          id: number
          life_insurance_amount: number | null
          life_insurance_enabled: boolean | null
          retirement_enabled: boolean | null
          retirement_percentage: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: number | null
          health_insurance_amount?: number | null
          health_insurance_enabled?: boolean | null
          id?: number
          life_insurance_amount?: number | null
          life_insurance_enabled?: boolean | null
          retirement_enabled?: boolean | null
          retirement_percentage?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: number | null
          health_insurance_amount?: number | null
          health_insurance_enabled?: boolean | null
          id?: number
          life_insurance_amount?: number | null
          life_insurance_enabled?: boolean | null
          retirement_enabled?: boolean | null
          retirement_percentage?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_deductions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      employeeavailability: {
        Row: {
          "5": number
          availabilityid: number
          dayofweek: string
          endtime: string
          ispreferred: boolean | null
          starttime: string
        }
        Insert: {
          "5": number
          availabilityid?: number
          dayofweek?: string
          endtime: string
          ispreferred?: boolean | null
          starttime: string
        }
        Update: {
          "5"?: number
          availabilityid?: number
          dayofweek?: string
          endtime?: string
          ispreferred?: boolean | null
          starttime?: string
        }
        Relationships: [
          {
            foreignKeyName: "employeeavailability_5_fkey"
            columns: ["5"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      employeepositions: {
        Row: {
          access_level: string | null
          certification_expiry: string | null
          custom_payrate: number | null
          employeeid: number | null
          employeepositionid: number
          is_primary: boolean | null
          last_modified: string | null
          payrate: number
          positionid: number | null
        }
        Insert: {
          access_level?: string | null
          certification_expiry?: string | null
          custom_payrate?: number | null
          employeeid?: number | null
          employeepositionid?: number
          is_primary?: boolean | null
          last_modified?: string | null
          payrate: number
          positionid?: number | null
        }
        Update: {
          access_level?: string | null
          certification_expiry?: string | null
          custom_payrate?: number | null
          employeeid?: number | null
          employeepositionid?: number
          is_primary?: boolean | null
          last_modified?: string | null
          payrate?: number
          positionid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employeepositions_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "employeepositions_positionid_fkey"
            columns: ["positionid"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["positionid"]
          },
        ]
      }
      employees: {
        Row: {
          email: string
          employeeid: number
          firstname: string
          hiredate: string
          is_admin: boolean | null
          isactive: boolean | null
          lastname: string
          phonenumber: string | null
          position_id: number | null
          suspended: boolean | null
        }
        Insert: {
          email: string
          employeeid?: number
          firstname: string
          hiredate: string
          is_admin?: boolean | null
          isactive?: boolean | null
          lastname: string
          phonenumber?: string | null
          position_id?: number | null
          suspended?: boolean | null
        }
        Update: {
          email?: string
          employeeid?: number
          firstname?: string
          hiredate?: string
          is_admin?: boolean | null
          isactive?: boolean | null
          lastname?: string
          phonenumber?: string | null
          position_id?: number | null
          suspended?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["positionid"]
          },
          {
            foreignKeyName: "fk_employee_position"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["positionid"]
          },
        ]
      }
      ghl_synced_calendars: {
        Row: {
          calendar_name: string
          calendar_type: string | null
          created_at: string | null
          description: string | null
          ghl_calendar_id: string
          ghl_location_id: string
          id: number
          is_active: boolean | null
          settings: Json | null
          synced_at: string | null
          team_members: Json | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calendar_name: string
          calendar_type?: string | null
          created_at?: string | null
          description?: string | null
          ghl_calendar_id: string
          ghl_location_id: string
          id?: number
          is_active?: boolean | null
          settings?: Json | null
          synced_at?: string | null
          team_members?: Json | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calendar_name?: string
          calendar_type?: string | null
          created_at?: string | null
          description?: string | null
          ghl_calendar_id?: string
          ghl_location_id?: string
          id?: number
          is_active?: boolean | null
          settings?: Json | null
          synced_at?: string | null
          team_members?: Json | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ghl_synced_users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          ghl_location_id: string
          ghl_user_id: string
          id: number
          is_active: boolean | null
          last_name: string | null
          permissions: Json | null
          phone: string | null
          role: string | null
          synced_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          ghl_location_id: string
          ghl_user_id: string
          id?: number
          is_active?: boolean | null
          last_name?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: string | null
          synced_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          ghl_location_id?: string
          ghl_user_id?: string
          id?: number
          is_active?: boolean | null
          last_name?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: string | null
          synced_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ghl_user_availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          ghl_calendar_id: string
          ghl_location_id: string
          ghl_user_id: string
          id: number
          is_available: boolean | null
          start_time: string
          synced_at: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          ghl_calendar_id: string
          ghl_location_id: string
          ghl_user_id: string
          id?: number
          is_available?: boolean | null
          start_time: string
          synced_at?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          ghl_calendar_id?: string
          ghl_location_id?: string
          ghl_user_id?: string
          id?: number
          is_available?: boolean | null
          start_time?: string
          synced_at?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          employeeid: number | null
          isread: boolean | null
          message: string
          notificationdate: string | null
          notificationid: number
          notificationtype: string
        }
        Insert: {
          employeeid?: number | null
          isread?: boolean | null
          message: string
          notificationdate?: string | null
          notificationid?: number
          notificationtype: string
        }
        Update: {
          employeeid?: number | null
          isread?: boolean | null
          message?: string
          notificationdate?: string | null
          notificationid?: number
          notificationtype?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      oauth_connections: {
        Row: {
          created_at: string | null
          id: number
          location_address: string | null
          location_id: string | null
          location_name: string | null
          provider: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: number
          location_address?: string | null
          location_id?: string | null
          location_name?: string | null
          provider: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          location_address?: string | null
          location_id?: string | null
          location_name?: string | null
          provider?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      oauth_tokens: {
        Row: {
          access_token: string
          created_at: string | null
          expires_at: number | null
          id: number
          provider: string
          refresh_token: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          created_at?: string | null
          expires_at?: number | null
          id: number
          provider: string
          refresh_token: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string | null
          expires_at?: number | null
          id?: number
          provider?: string
          refresh_token?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      overtimerules: {
        Row: {
          description: string
          overtimeratemultiplier: number | null
          ruleid: number
          thresholdhours: number
        }
        Insert: {
          description: string
          overtimeratemultiplier?: number | null
          ruleid?: number
          thresholdhours: number
        }
        Update: {
          description?: string
          overtimeratemultiplier?: number | null
          ruleid?: number
          thresholdhours?: number
        }
        Relationships: []
      }
      payroll_records: {
        Row: {
          adjustments: Json | null
          created_at: string | null
          created_by: number | null
          gross_pay: number
          last_edited_at: string | null
          last_edited_by: number | null
          net_pay: number
          notes: string | null
          pay_period_end: string
          pay_period_start: string
          record_id: number
          status: string
          total_hours: number
          total_overtime_hours: number
        }
        Insert: {
          adjustments?: Json | null
          created_at?: string | null
          created_by?: number | null
          gross_pay?: number
          last_edited_at?: string | null
          last_edited_by?: number | null
          net_pay?: number
          notes?: string | null
          pay_period_end: string
          pay_period_start: string
          record_id?: number
          status?: string
          total_hours?: number
          total_overtime_hours?: number
        }
        Update: {
          adjustments?: Json | null
          created_at?: string | null
          created_by?: number | null
          gross_pay?: number
          last_edited_at?: string | null
          last_edited_by?: number | null
          net_pay?: number
          notes?: string | null
          pay_period_end?: string
          pay_period_start?: string
          record_id?: number
          status?: string
          total_hours?: number
          total_overtime_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "payroll_records_last_edited_by_fkey"
            columns: ["last_edited_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      positions: {
        Row: {
          access_level: Json | null
          defaultpayrate: number | null
          description: string | null
          min_experience_months: number | null
          paytype: string | null
          positionid: number
          positionname: string
          required_certifications: string[] | null
        }
        Insert: {
          access_level?: Json | null
          defaultpayrate?: number | null
          description?: string | null
          min_experience_months?: number | null
          paytype?: string | null
          positionid?: number
          positionname: string
          required_certifications?: string[] | null
        }
        Update: {
          access_level?: Json | null
          defaultpayrate?: number | null
          description?: string | null
          min_experience_months?: number | null
          paytype?: string | null
          positionid?: number
          positionname?: string
          required_certifications?: string[] | null
        }
        Relationships: []
      }
      pto_holiday_settings: {
        Row: {
          created_at: string | null
          current_pto_balance: number | null
          employee_id: number | null
          enabled: boolean | null
          id: number
          paid_holidays_enabled: boolean | null
          pto_accrual_rate: number | null
          pto_days_per_year: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_pto_balance?: number | null
          employee_id?: number | null
          enabled?: boolean | null
          id?: number
          paid_holidays_enabled?: boolean | null
          pto_accrual_rate?: number | null
          pto_days_per_year?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_pto_balance?: number | null
          employee_id?: number | null
          enabled?: boolean | null
          id?: number
          paid_holidays_enabled?: boolean | null
          pto_accrual_rate?: number | null
          pto_days_per_year?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pto_holiday_settings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      reports: {
        Row: {
          generatedby: number | null
          generateddate: string | null
          reportdata: Json
          reportid: number
          reportname: string
          reporttype: string
        }
        Insert: {
          generatedby?: number | null
          generateddate?: string | null
          reportdata: Json
          reportid?: number
          reportname: string
          reporttype: string
        }
        Update: {
          generatedby?: number | null
          generateddate?: string | null
          reportdata?: Json
          reportid?: number
          reportname?: string
          reporttype?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_generatedby_fkey"
            columns: ["generatedby"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      schedule_time_slots: {
        Row: {
          created_at: string | null
          day_of_week: string
          end_time: string
          schedule_type_id: number | null
          slot_id: number
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: string
          end_time: string
          schedule_type_id?: number | null
          slot_id?: number
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: string
          end_time?: string
          schedule_type_id?: number | null
          slot_id?: number
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_time_slots_schedule_type_id_fkey"
            columns: ["schedule_type_id"]
            isOneToOne: false
            referencedRelation: "schedule_types"
            referencedColumns: ["schedule_type_id"]
          },
        ]
      }
      schedule_types: {
        Row: {
          closing_time: string | null
          created_at: string | null
          duration: number
          name: string
          opening_time: string | null
          operational_days: string[] | null
          schedule_type_id: number
          updated_at: string | null
        }
        Insert: {
          closing_time?: string | null
          created_at?: string | null
          duration?: number
          name: string
          opening_time?: string | null
          operational_days?: string[] | null
          schedule_type_id?: number
          updated_at?: string | null
        }
        Update: {
          closing_time?: string | null
          created_at?: string | null
          duration?: number
          name?: string
          opening_time?: string | null
          operational_days?: string[] | null
          schedule_type_id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          breakduration: number | null
          color: string | null
          employeeid: number | null
          endtime: string
          is_template: boolean | null
          locationid: number | null
          notes: string | null
          positionid: number | null
          recurring_pattern: string | null
          scheduleid: number
          shiftdate: string
          starttime: string
          template_name: string | null
        }
        Insert: {
          breakduration?: number | null
          color?: string | null
          employeeid?: number | null
          endtime: string
          is_template?: boolean | null
          locationid?: number | null
          notes?: string | null
          positionid?: number | null
          recurring_pattern?: string | null
          scheduleid?: number
          shiftdate: string
          starttime: string
          template_name?: string | null
        }
        Update: {
          breakduration?: number | null
          color?: string | null
          employeeid?: number | null
          endtime?: string
          is_template?: boolean | null
          locationid?: number | null
          notes?: string | null
          positionid?: number | null
          recurring_pattern?: string | null
          scheduleid?: number
          shiftdate?: string
          starttime?: string
          template_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "schedules_locationid_fkey"
            columns: ["locationid"]
            isOneToOne: false
            referencedRelation: "businesslocations"
            referencedColumns: ["locationid"]
          },
          {
            foreignKeyName: "schedules_positionid_fkey"
            columns: ["positionid"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["positionid"]
          },
        ]
      }
      shifthistory: {
        Row: {
          actiondate: string | null
          actiontype: string
          changes: Json
          historyid: number
          performedby: number | null
          scheduleid: number | null
        }
        Insert: {
          actiondate?: string | null
          actiontype: string
          changes: Json
          historyid?: number
          performedby?: number | null
          scheduleid?: number | null
        }
        Update: {
          actiondate?: string | null
          actiontype?: string
          changes?: Json
          historyid?: number
          performedby?: number | null
          scheduleid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shifthistory_performedby_fkey"
            columns: ["performedby"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "shifthistory_scheduleid_fkey"
            columns: ["scheduleid"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["scheduleid"]
          },
        ]
      }
      shiftswaprequests: {
        Row: {
          notes: string | null
          requestdate: string | null
          requestedby: number | null
          requestedto: number | null
          scheduleid: number | null
          status: string | null
          swaprequestid: number
        }
        Insert: {
          notes?: string | null
          requestdate?: string | null
          requestedby?: number | null
          requestedto?: number | null
          scheduleid?: number | null
          status?: string | null
          swaprequestid?: number
        }
        Update: {
          notes?: string | null
          requestdate?: string | null
          requestedby?: number | null
          requestedto?: number | null
          scheduleid?: number | null
          status?: string | null
          swaprequestid?: number
        }
        Relationships: [
          {
            foreignKeyName: "shiftswaprequests_requestedby_fkey"
            columns: ["requestedby"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "shiftswaprequests_requestedto_fkey"
            columns: ["requestedto"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "shiftswaprequests_scheduleid_fkey"
            columns: ["scheduleid"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["scheduleid"]
          },
        ]
      }
      tax_withholding_settings: {
        Row: {
          created_at: string | null
          employee_id: number | null
          federal_enabled: boolean | null
          federal_rate: number | null
          fica_enabled: boolean | null
          fica_rate: number | null
          id: number
          local_enabled: boolean | null
          local_rate: number | null
          social_security_enabled: boolean | null
          social_security_rate: number | null
          state_enabled: boolean | null
          state_rate: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: number | null
          federal_enabled?: boolean | null
          federal_rate?: number | null
          fica_enabled?: boolean | null
          fica_rate?: number | null
          id?: number
          local_enabled?: boolean | null
          local_rate?: number | null
          social_security_enabled?: boolean | null
          social_security_rate?: number | null
          state_enabled?: boolean | null
          state_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: number | null
          federal_enabled?: boolean | null
          federal_rate?: number | null
          fica_enabled?: boolean | null
          fica_rate?: number | null
          id?: number
          local_enabled?: boolean | null
          local_rate?: number | null
          social_security_enabled?: boolean | null
          social_security_rate?: number | null
          state_enabled?: boolean | null
          state_rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_withholding_settings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      template_slots: {
        Row: {
          class_type: string | null
          created_at: string | null
          day_of_week: string
          end_time: string
          max_capacity: number | null
          slot_id: number
          start_time: string
          template_id: number | null
        }
        Insert: {
          class_type?: string | null
          created_at?: string | null
          day_of_week: string
          end_time: string
          max_capacity?: number | null
          slot_id?: number
          start_time: string
          template_id?: number | null
        }
        Update: {
          class_type?: string | null
          created_at?: string | null
          day_of_week?: string
          end_time?: string
          max_capacity?: number | null
          slot_id?: number
          start_time?: string
          template_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "template_slots_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["scheduleid"]
          },
        ]
      }
      time_off_requests: {
        Row: {
          approved_at: string | null
          approved_by: number | null
          created_at: string | null
          employee_id: number | null
          end_date: string
          reason: string | null
          request_id: number
          start_date: string
          status: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: number | null
          created_at?: string | null
          employee_id?: number | null
          end_date: string
          reason?: string | null
          request_id?: number
          start_date: string
          status?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: number | null
          created_at?: string | null
          employee_id?: number | null
          end_date?: string
          reason?: string | null
          request_id?: number
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_off_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "time_off_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
        ]
      }
      timeentries: {
        Row: {
          approvalby: number | null
          approvaldate: string | null
          breakduration: number | null
          clockintime: string
          clockouttime: string | null
          employeeid: number | null
          hoursworked: number | null
          isapproved: boolean | null
          islate: boolean | null
          isovertime: boolean | null
          notes: string | null
          positionid: number | null
          scheduleid: number | null
          timeentryid: number
        }
        Insert: {
          approvalby?: number | null
          approvaldate?: string | null
          breakduration?: number | null
          clockintime: string
          clockouttime?: string | null
          employeeid?: number | null
          hoursworked?: number | null
          isapproved?: boolean | null
          islate?: boolean | null
          isovertime?: boolean | null
          notes?: string | null
          positionid?: number | null
          scheduleid?: number | null
          timeentryid?: number
        }
        Update: {
          approvalby?: number | null
          approvaldate?: string | null
          breakduration?: number | null
          clockintime?: string
          clockouttime?: string | null
          employeeid?: number | null
          hoursworked?: number | null
          isapproved?: boolean | null
          islate?: boolean | null
          isovertime?: boolean | null
          notes?: string | null
          positionid?: number | null
          scheduleid?: number | null
          timeentryid?: number
        }
        Relationships: [
          {
            foreignKeyName: "timeentries_approvalby_fkey"
            columns: ["approvalby"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "timeentries_employeeid_fkey"
            columns: ["employeeid"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employeeid"]
          },
          {
            foreignKeyName: "timeentries_positionid_fkey"
            columns: ["positionid"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["positionid"]
          },
          {
            foreignKeyName: "timeentries_scheduleid_fkey"
            columns: ["scheduleid"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["scheduleid"]
          },
        ]
      }
      user_integrations: {
        Row: {
          connection_method: string
          created_at: string | null
          credentials: Json | null
          id: number
          integration_type: string
          last_synced_at: string | null
          location_id: string | null
          status: string
          synced_data: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          connection_method: string
          created_at?: string | null
          credentials?: Json | null
          id?: number
          integration_type: string
          last_synced_at?: string | null
          location_id?: string | null
          status: string
          synced_data?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          connection_method?: string
          created_at?: string | null
          credentials?: Json | null
          id?: number
          integration_type?: string
          last_synced_at?: string | null
          location_id?: string | null
          status?: string
          synced_data?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      calculate_employee_hours: {
        Args: { employee_id: number; start_date: string; end_date: string }
        Returns: {
          total_scheduled_hours: number
          total_worked_hours: number
          total_overtime_hours: number
          late_clock_ins: number
          missed_clock_ins: number
          schedule_details: Json
        }[]
      }
      check_and_create_oauth_tokens_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_and_create_user_integrations_table: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_employee_attendance_summary: {
        Args: { start_date: string; end_date: string }
        Returns: {
          employee_name: string
          position_name: string
          total_scheduled_shifts: number
          completed_shifts: number
          missed_shifts: number
          late_arrivals: number
          total_overtime_hours: number
        }[]
      }
      get_position_schedule_summary: {
        Args: { start_date: string; end_date: string }
        Returns: {
          position_name: string
          total_shifts: number
          total_scheduled_hours: number
          total_employees: number
          avg_shift_duration: number
        }[]
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { uri: string }
          | { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { uri: string } | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { uri: string; content: string; content_type: string }
          | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
