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
        ]
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
        ]
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
        ]
      }
      presentation_sessions: {
        Row: {
          audience_size: number | null
          created_at: string
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
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
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
