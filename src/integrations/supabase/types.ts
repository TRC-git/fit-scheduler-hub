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
          locationname: string
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
          locationname: string
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
          locationname?: string
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
          availabilityid: number
          dayofweek: string
          employeeid: number | null
          endtime: string
          ispreferred: boolean | null
          starttime: string
        }
        Insert: {
          availabilityid?: number
          dayofweek: string
          employeeid?: number | null
          endtime: string
          ispreferred?: boolean | null
          starttime: string
        }
        Update: {
          availabilityid?: number
          dayofweek?: string
          employeeid?: number | null
          endtime?: string
          ispreferred?: boolean | null
          starttime?: string
        }
        Relationships: [
          {
            foreignKeyName: "employeeavailability_employeeid_fkey"
            columns: ["employeeid"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_employee_hours: {
        Args: {
          employee_id: number
          start_date: string
          end_date: string
        }
        Returns: {
          total_scheduled_hours: number
          total_worked_hours: number
          total_overtime_hours: number
          late_clock_ins: number
          missed_clock_ins: number
          schedule_details: Json
        }[]
      }
      get_employee_attendance_summary: {
        Args: {
          start_date: string
          end_date: string
        }
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
        Args: {
          start_date: string
          end_date: string
        }
        Returns: {
          position_name: string
          total_shifts: number
          total_scheduled_hours: number
          total_employees: number
          avg_shift_duration: number
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
