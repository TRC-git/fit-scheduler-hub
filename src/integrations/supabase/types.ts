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
          latitude: number | null
          locationid: number
          locationname: string
          longitude: number | null
          radiusmeters: number | null
        }
        Insert: {
          address: string
          latitude?: number | null
          locationid?: number
          locationname: string
          longitude?: number | null
          radiusmeters?: number | null
        }
        Update: {
          address?: string
          latitude?: number | null
          locationid?: number
          locationname?: string
          longitude?: number | null
          radiusmeters?: number | null
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
      class_time_slots: {
        Row: {
          class_type_id: number | null
          created_at: string | null
          day_of_week: string
          end_time: string
          slot_id: number
          start_time: string
        }
        Insert: {
          class_type_id?: number | null
          created_at?: string | null
          day_of_week: string
          end_time: string
          slot_id?: number
          start_time: string
        }
        Update: {
          class_type_id?: number | null
          created_at?: string | null
          day_of_week?: string
          end_time?: string
          slot_id?: number
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_time_slots_class_type_id_fkey"
            columns: ["class_type_id"]
            isOneToOne: false
            referencedRelation: "class_types"
            referencedColumns: ["class_type_id"]
          },
        ]
      }
      class_types: {
        Row: {
          class_type_id: number
          closing_time: string | null
          created_at: string | null
          duration: number
          name: string
          opening_time: string | null
          operational_days: string[] | null
        }
        Insert: {
          class_type_id?: number
          closing_time?: string | null
          created_at?: string | null
          duration?: number
          name: string
          opening_time?: string | null
          operational_days?: string[] | null
        }
        Update: {
          class_type_id?: number
          closing_time?: string | null
          created_at?: string | null
          duration?: number
          name?: string
          opening_time?: string | null
          operational_days?: string[] | null
        }
        Relationships: []
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
          employeeid: number | null
          employeepositionid: number
          is_primary: boolean | null
          payrate: number
          positionid: number | null
        }
        Insert: {
          access_level?: string | null
          certification_expiry?: string | null
          employeeid?: number | null
          employeepositionid?: number
          is_primary?: boolean | null
          payrate: number
          positionid?: number | null
        }
        Update: {
          access_level?: string | null
          certification_expiry?: string | null
          employeeid?: number | null
          employeepositionid?: number
          is_primary?: boolean | null
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
          isactive: boolean | null
          lastname: string
          phonenumber: string | null
        }
        Insert: {
          email: string
          employeeid?: number
          firstname: string
          hiredate: string
          isactive?: boolean | null
          lastname: string
          phonenumber?: string | null
        }
        Update: {
          email?: string
          employeeid?: number
          firstname?: string
          hiredate?: string
          isactive?: boolean | null
          lastname?: string
          phonenumber?: string | null
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
          defaultpayrate: number | null
          description: string | null
          min_experience_months: number | null
          paytype: string | null
          positionid: number
          positionname: string
          required_certifications: string[] | null
        }
        Insert: {
          defaultpayrate?: number | null
          description?: string | null
          min_experience_months?: number | null
          paytype?: string | null
          positionid?: number
          positionname: string
          required_certifications?: string[] | null
        }
        Update: {
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
