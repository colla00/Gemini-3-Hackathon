export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_chat_history: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "presentation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_chat_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "public_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      attestation_groups: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          document_hash: string
          document_version: string
          id: string
          required_witnesses: number
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          document_hash: string
          document_version: string
          id?: string
          required_witnesses?: number
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          document_hash?: string
          document_version?: string
          id?: string
          required_witnesses?: number
          status?: string
        }
        Relationships: []
      }
      audience_questions: {
        Row: {
          answer: string | null
          asked_by: string | null
          created_at: string
          id: string
          is_answered: boolean | null
          question: string
          session_id: string | null
          slide_context: string | null
          upvotes: number | null
        }
        Insert: {
          answer?: string | null
          asked_by?: string | null
          created_at?: string
          id?: string
          is_answered?: boolean | null
          question: string
          session_id?: string | null
          slide_context?: string | null
          upvotes?: number | null
        }
        Update: {
          answer?: string | null
          asked_by?: string | null
          created_at?: string
          id?: string
          is_answered?: boolean | null
          question?: string
          session_id?: string | null
          slide_context?: string | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audience_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "presentation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audience_questions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "public_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          feedback_type: Database["public"]["Enums"]["feedback_type"]
          id: string
          message: string | null
          rating: number | null
          session_id: string | null
          slide_id: string | null
          submitted_by: string | null
        }
        Insert: {
          created_at?: string
          feedback_type?: Database["public"]["Enums"]["feedback_type"]
          id?: string
          message?: string | null
          rating?: number | null
          session_id?: string | null
          slide_id?: string | null
          submitted_by?: string | null
        }
        Update: {
          created_at?: string
          feedback_type?: Database["public"]["Enums"]["feedback_type"]
          id?: string
          message?: string | null
          rating?: number | null
          session_id?: string | null
          slide_id?: string | null
          submitted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "presentation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "public_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      handoff_reports: {
        Row: {
          created_at: string
          generated_at: string
          generated_by: string | null
          high_risk_count: number | null
          id: string
          medium_risk_count: number | null
          report_data: Json
          shift_type: string
          unit_name: string | null
        }
        Insert: {
          created_at?: string
          generated_at?: string
          generated_by?: string | null
          high_risk_count?: number | null
          id?: string
          medium_risk_count?: number | null
          report_data: Json
          shift_type: string
          unit_name?: string | null
        }
        Update: {
          created_at?: string
          generated_at?: string
          generated_by?: string | null
          high_risk_count?: number | null
          id?: string
          medium_risk_count?: number | null
          report_data?: Json
          shift_type?: string
          unit_name?: string | null
        }
        Relationships: []
      }
      patent_activities: {
        Row: {
          activity_type: string
          created_at: string
          created_by: string | null
          description: string | null
          document_hash: string
          id: string
          metadata: Json | null
          title: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_hash: string
          id?: string
          metadata?: Json | null
          title: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          document_hash?: string
          id?: string
          metadata?: Json | null
          title?: string
        }
        Relationships: []
      }
      patent_attestations: {
        Row: {
          attestation_group_id: string | null
          attested_at: string
          claims_count: number
          created_at: string
          created_by: string | null
          document_hash: string
          document_version: string
          id: string
          ip_address: string | null
          organization: string | null
          signature: string
          user_agent: string | null
          witness_name: string
          witness_title: string
        }
        Insert: {
          attestation_group_id?: string | null
          attested_at?: string
          claims_count?: number
          created_at?: string
          created_by?: string | null
          document_hash: string
          document_version: string
          id?: string
          ip_address?: string | null
          organization?: string | null
          signature: string
          user_agent?: string | null
          witness_name: string
          witness_title: string
        }
        Update: {
          attestation_group_id?: string | null
          attested_at?: string
          claims_count?: number
          created_at?: string
          created_by?: string | null
          document_hash?: string
          document_version?: string
          id?: string
          ip_address?: string | null
          organization?: string | null
          signature?: string
          user_agent?: string | null
          witness_name?: string
          witness_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "patent_attestations_attestation_group_id_fkey"
            columns: ["attestation_group_id"]
            isOneToOne: false
            referencedRelation: "attestation_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      patent_claim_screenshots: {
        Row: {
          caption: string | null
          claim_number: number
          created_at: string
          document_hash: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          claim_number: number
          created_at?: string
          document_hash: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          claim_number?: number
          created_at?: string
          document_hash?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      poll_responses: {
        Row: {
          created_at: string
          id: string
          poll_id: string | null
          selected_options: Json
          voter_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          poll_id?: string | null
          selected_options: Json
          voter_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          poll_id?: string | null
          selected_options?: Json
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_responses_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          options: Json
          poll_type: Database["public"]["Enums"]["poll_type"]
          question: string
          session_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          options?: Json
          poll_type?: Database["public"]["Enums"]["poll_type"]
          question: string
          session_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          options?: Json
          poll_type?: Database["public"]["Enums"]["poll_type"]
          question?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "polls_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "presentation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polls_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "public_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      presentation_sessions: {
        Row: {
          audience_size: number | null
          created_at: string
          creator_id: string | null
          ended_at: string | null
          id: string
          is_live: boolean | null
          presenter_name: string | null
          session_key: string | null
          slides_completed: number | null
          started_at: string
          total_slides: number | null
        }
        Insert: {
          audience_size?: number | null
          created_at?: string
          creator_id?: string | null
          ended_at?: string | null
          id?: string
          is_live?: boolean | null
          presenter_name?: string | null
          session_key?: string | null
          slides_completed?: number | null
          started_at?: string
          total_slides?: number | null
        }
        Update: {
          audience_size?: number | null
          created_at?: string
          creator_id?: string | null
          ended_at?: string | null
          id?: string
          is_live?: boolean | null
          presenter_name?: string | null
          session_key?: string | null
          slides_completed?: number | null
          started_at?: string
          total_slides?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limit_violations: {
        Row: {
          created_at: string
          endpoint: string
          first_violation_at: string
          id: string
          ip_address: string | null
          key: string
          last_violation_at: string
          violation_count: number
        }
        Insert: {
          created_at?: string
          endpoint: string
          first_violation_at?: string
          id?: string
          ip_address?: string | null
          key: string
          last_violation_at?: string
          violation_count?: number
        }
        Update: {
          created_at?: string
          endpoint?: string
          first_violation_at?: string
          id?: string
          ip_address?: string | null
          key?: string
          last_violation_at?: string
          violation_count?: number
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          count: number
          created_at: string
          id: string
          key: string
          updated_at: string
          window_start: string
        }
        Insert: {
          count?: number
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          window_start?: string
        }
        Update: {
          count?: number
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      viewer_analytics: {
        Row: {
          created_at: string
          device_type: string | null
          id: string
          interactions: Json | null
          session_id: string | null
          slide_id: string
          time_on_slide: number | null
          viewer_id: string
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          id?: string
          interactions?: Json | null
          session_id?: string | null
          slide_id: string
          time_on_slide?: number | null
          viewer_id?: string
        }
        Update: {
          created_at?: string
          device_type?: string | null
          id?: string
          interactions?: Json | null
          session_id?: string | null
          slide_id?: string
          time_on_slide?: number | null
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewer_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "presentation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viewer_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "public_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      walkthrough_access_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          organization: string | null
          reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          role: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          organization?: string | null
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          organization?: string | null
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_sessions: {
        Row: {
          audience_size: number | null
          id: string | null
          is_live: boolean | null
          presenter_name: string | null
          session_key: string | null
          slides_completed: number | null
          started_at: string | null
          total_slides: number | null
        }
        Insert: {
          audience_size?: number | null
          id?: string | null
          is_live?: boolean | null
          presenter_name?: string | null
          session_key?: string | null
          slides_completed?: number | null
          started_at?: string | null
          total_slides?: number | null
        }
        Update: {
          audience_size?: number | null
          id?: string | null
          is_live?: boolean | null
          presenter_name?: string | null
          session_key?: string | null
          slides_completed?: number | null
          started_at?: string | null
          total_slides?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_key: string
          p_max_requests: number
          p_window_seconds: number
        }
        Returns: Json
      }
      cleanup_rate_limit_violations: {
        Args: { p_older_than_days?: number }
        Returns: number
      }
      cleanup_rate_limits: {
        Args: { p_older_than_hours?: number }
        Returns: number
      }
      get_rate_limit_stats: { Args: { p_hours?: number }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_rate_limit_violation: {
        Args: { p_endpoint: string; p_ip_address: string; p_key: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "viewer"
      feedback_type:
        | "positive"
        | "neutral"
        | "negative"
        | "question"
        | "suggestion"
      poll_type: "single_choice" | "multiple_choice" | "rating" | "yes_no"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "viewer"],
      feedback_type: [
        "positive",
        "neutral",
        "negative",
        "question",
        "suggestion",
      ],
      poll_type: ["single_choice", "multiple_choice", "rating", "yes_no"],
    },
  },
} as const
