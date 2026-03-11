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
    PostgrestVersion: "14.1"
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
      blog_posts: {
        Row: {
          author_name: string
          category: string
          content: string
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          excerpt: string | null
          id: string
          is_published: boolean
          meta_description: string | null
          og_image_url: string | null
          published_at: string | null
          read_time_minutes: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string
          category?: string
          content: string
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          og_image_url?: string | null
          published_at?: string | null
          read_time_minutes?: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          category?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          og_image_url?: string | null
          published_at?: string | null
          read_time_minutes?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      breach_incidents: {
        Row: {
          affected_individuals: number | null
          containment_date: string | null
          corrective_actions: string | null
          created_at: string
          description: string | null
          discovery_date: string
          eradication_date: string | null
          id: string
          incident_number: string
          lessons_learned: string | null
          notification_deadline: string | null
          phi_involved: boolean
          recovery_date: string | null
          reported_by: string | null
          reported_to_hhs: boolean | null
          reported_to_individuals: boolean | null
          reported_to_media: boolean | null
          root_cause: string | null
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          affected_individuals?: number | null
          containment_date?: string | null
          corrective_actions?: string | null
          created_at?: string
          description?: string | null
          discovery_date?: string
          eradication_date?: string | null
          id?: string
          incident_number?: string
          lessons_learned?: string | null
          notification_deadline?: string | null
          phi_involved?: boolean
          recovery_date?: string | null
          reported_by?: string | null
          reported_to_hhs?: boolean | null
          reported_to_individuals?: boolean | null
          reported_to_media?: boolean | null
          root_cause?: string | null
          severity?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          affected_individuals?: number | null
          containment_date?: string | null
          corrective_actions?: string | null
          created_at?: string
          description?: string | null
          discovery_date?: string
          eradication_date?: string | null
          id?: string
          incident_number?: string
          lessons_learned?: string | null
          notification_deadline?: string | null
          phi_involved?: boolean
          recovery_date?: string | null
          reported_by?: string | null
          reported_to_hhs?: boolean | null
          reported_to_individuals?: boolean | null
          reported_to_media?: boolean | null
          root_cause?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      changelog_entries: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          is_published: boolean
          published_at: string
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          is_published?: boolean
          published_at?: string
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          is_published?: boolean
          published_at?: string
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          inquiry_type: string
          irb_status: string | null
          message: string
          name: string
          organization: string | null
          role: string | null
          status: string
          timeline: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          inquiry_type: string
          irb_status?: string | null
          message: string
          name: string
          organization?: string | null
          role?: string | null
          status?: string
          timeline?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          irb_status?: string | null
          message?: string
          name?: string
          organization?: string | null
          role?: string | null
          status?: string
          timeline?: string | null
        }
        Relationships: []
      }
      data_deletion_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          reason: string | null
          request_type: string
          requester_email: string
          requester_name: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          reason?: string | null
          request_type?: string
          requester_email: string
          requester_name: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          reason?: string | null
          request_type?: string
          requester_email?: string
          requester_name?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      data_retention_policies: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          last_cleanup_at: string | null
          retention_days: number
          rows_deleted_last_run: number | null
          table_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          last_cleanup_at?: string | null
          retention_days?: number
          rows_deleted_last_run?: number | null
          table_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          last_cleanup_at?: string | null
          retention_days?: number
          rows_deleted_last_run?: number | null
          table_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      dataroom_access_logs: {
        Row: {
          action: string
          created_at: string
          document_id: string
          id: string
          ip_address: string | null
          user_email: string | null
          user_id: string
        }
        Insert: {
          action?: string
          created_at?: string
          document_id: string
          id?: string
          ip_address?: string | null
          user_email?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          document_id?: string
          id?: string
          ip_address?: string | null
          user_email?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dataroom_access_logs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "dataroom_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      dataroom_documents: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_name: string | null
          file_path: string | null
          file_size: number | null
          id: string
          is_confidential: boolean
          sort_order: number
          title: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_confidential?: boolean
          sort_order?: number
          title: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          is_confidential?: boolean
          sort_order?: number
          title?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      encryption_keys: {
        Row: {
          created_at: string
          id: string
          key_name: string
          key_value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_name: string
          key_value: string
        }
        Update: {
          created_at?: string
          id?: string
          key_name?: string
          key_value?: string
        }
        Relationships: []
      }
      fda_presub_documents: {
        Row: {
          created_at: string
          created_by: string | null
          document_type: string
          id: string
          sections: Json
          status: string
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_type?: string
          id?: string
          sections?: Json
          status?: string
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_type?: string
          id?: string
          sections?: Json
          status?: string
          title?: string
          updated_at?: string
          version?: string | null
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
      fhir_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          patient_id: string | null
          payload: Json
          processed_at: string | null
          resource_id: string | null
          resource_type: string
          signature_valid: boolean | null
          source_ip: string | null
          vendor: string | null
        }
        Insert: {
          created_at?: string
          event_type?: string
          id?: string
          patient_id?: string | null
          payload?: Json
          processed_at?: string | null
          resource_id?: string | null
          resource_type: string
          signature_valid?: boolean | null
          source_ip?: string | null
          vendor?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          patient_id?: string | null
          payload?: Json
          processed_at?: string | null
          resource_id?: string | null
          resource_type?: string
          signature_valid?: boolean | null
          source_ip?: string | null
          vendor?: string | null
        }
        Relationships: []
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
      hipaa_training_completions: {
        Row: {
          certificate_number: string | null
          completed_at: string
          created_at: string
          expires_at: string
          id: string
          module_id: string
          passed: boolean
          score: number | null
          user_id: string
        }
        Insert: {
          certificate_number?: string | null
          completed_at?: string
          created_at?: string
          expires_at?: string
          id?: string
          module_id: string
          passed?: boolean
          score?: number | null
          user_id: string
        }
        Update: {
          certificate_number?: string | null
          completed_at?: string
          created_at?: string
          expires_at?: string
          id?: string
          module_id?: string
          passed?: boolean
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hipaa_training_completions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "hipaa_training_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      hipaa_training_modules: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          is_required: boolean
          passing_score: number
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          is_required?: boolean
          passing_score?: number
          title: string
          updated_at?: string
          version?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          is_required?: boolean
          passing_score?: number
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      hub_tasks: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          sort_order: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      licensing_inquiries: {
        Row: {
          contact_name: string
          created_at: string
          email: string
          id: string
          message: string | null
          nda_agreed: boolean
          organization_name: string
          organization_type: string
          payment_status: string | null
          phone: string | null
          status: string
          stripe_session_id: string | null
          systems_of_interest: string[]
        }
        Insert: {
          contact_name: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          nda_agreed?: boolean
          organization_name: string
          organization_type: string
          payment_status?: string | null
          phone?: string | null
          status?: string
          stripe_session_id?: string | null
          systems_of_interest?: string[]
        }
        Update: {
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          nda_agreed?: boolean
          organization_name?: string
          organization_type?: string
          payment_status?: string | null
          phone?: string | null
          status?: string
          stripe_session_id?: string | null
          systems_of_interest?: string[]
        }
        Relationships: []
      }
      office_actions: {
        Row: {
          action_type: string
          art_unit: string | null
          cited_references: string[] | null
          created_at: string
          created_by: string | null
          examiner_name: string | null
          id: string
          mailing_date: string | null
          patent_id: string
          rejection_types: string[] | null
          responded_at: string | null
          response_deadline: string | null
          response_notes: string | null
          status: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          action_type?: string
          art_unit?: string | null
          cited_references?: string[] | null
          created_at?: string
          created_by?: string | null
          examiner_name?: string | null
          id?: string
          mailing_date?: string | null
          patent_id: string
          rejection_types?: string[] | null
          responded_at?: string | null
          response_deadline?: string | null
          response_notes?: string | null
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          action_type?: string
          art_unit?: string | null
          cited_references?: string[] | null
          created_at?: string
          created_by?: string | null
          examiner_name?: string | null
          id?: string
          mailing_date?: string | null
          patent_id?: string
          rejection_types?: string[] | null
          responded_at?: string | null
          response_deadline?: string | null
          response_notes?: string | null
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "office_actions_patent_id_fkey"
            columns: ["patent_id"]
            isOneToOne: false
            referencedRelation: "patents"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          country: string | null
          created_at: string
          id: string
          page_path: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          page_path: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          page_path?: string
          referrer?: string | null
          user_agent?: string | null
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
          confirmation_sent_at: string | null
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string
          created_by: string | null
          document_hash: string
          document_version: string
          email_confirmed: boolean | null
          id: string
          ip_address: string | null
          ip_address_encrypted: string | null
          organization: string | null
          signature: string
          user_agent: string | null
          witness_email: string | null
          witness_email_encrypted: string | null
          witness_name: string
          witness_title: string
        }
        Insert: {
          attestation_group_id?: string | null
          attested_at?: string
          claims_count?: number
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          document_hash: string
          document_version: string
          email_confirmed?: boolean | null
          id?: string
          ip_address?: string | null
          ip_address_encrypted?: string | null
          organization?: string | null
          signature: string
          user_agent?: string | null
          witness_email?: string | null
          witness_email_encrypted?: string | null
          witness_name: string
          witness_title: string
        }
        Update: {
          attestation_group_id?: string | null
          attested_at?: string
          claims_count?: number
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string
          created_by?: string | null
          document_hash?: string
          document_version?: string
          email_confirmed?: boolean | null
          id?: string
          ip_address?: string | null
          ip_address_encrypted?: string | null
          organization?: string | null
          signature?: string
          user_agent?: string | null
          witness_email?: string | null
          witness_email_encrypted?: string | null
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
      patent_figures: {
        Row: {
          caption: string | null
          created_at: string
          figure_number: number
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          patent_id: string
          sort_order: number
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          figure_number: number
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          patent_id: string
          sort_order?: number
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          figure_number?: number
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          patent_id?: string
          sort_order?: number
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      patent_filing_receipts: {
        Row: {
          application_number: string | null
          claims_count: number | null
          confirmation_number: string | null
          created_at: string
          created_by: string | null
          entity_type: string
          examination_fee_paid: number | null
          excess_claims_fee: number | null
          filing_date: string | null
          filing_fee_paid: number | null
          filing_type: string
          id: string
          independent_claims_count: number | null
          notes: string | null
          patent_id: string | null
          receipt_date: string | null
          receipt_document_path: string | null
          search_fee_paid: number | null
          total_fees_paid: number | null
          updated_at: string
        }
        Insert: {
          application_number?: string | null
          claims_count?: number | null
          confirmation_number?: string | null
          created_at?: string
          created_by?: string | null
          entity_type?: string
          examination_fee_paid?: number | null
          excess_claims_fee?: number | null
          filing_date?: string | null
          filing_fee_paid?: number | null
          filing_type?: string
          id?: string
          independent_claims_count?: number | null
          notes?: string | null
          patent_id?: string | null
          receipt_date?: string | null
          receipt_document_path?: string | null
          search_fee_paid?: number | null
          total_fees_paid?: number | null
          updated_at?: string
        }
        Update: {
          application_number?: string | null
          claims_count?: number | null
          confirmation_number?: string | null
          created_at?: string
          created_by?: string | null
          entity_type?: string
          examination_fee_paid?: number | null
          excess_claims_fee?: number | null
          filing_date?: string | null
          filing_fee_paid?: number | null
          filing_type?: string
          id?: string
          independent_claims_count?: number | null
          notes?: string | null
          patent_id?: string | null
          receipt_date?: string | null
          receipt_document_path?: string | null
          search_fee_paid?: number | null
          total_fees_paid?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patent_filing_receipts_patent_id_fkey"
            columns: ["patent_id"]
            isOneToOne: false
            referencedRelation: "patents"
            referencedColumns: ["id"]
          },
        ]
      }
      patents: {
        Row: {
          attorney_assigned: boolean
          bundle_group: string | null
          created_at: string
          description: string | null
          filing_date: string | null
          id: string
          nickname: string
          notes: string | null
          np_deadline: string
          patent_number: string
          priority_level: string
          status: string
        }
        Insert: {
          attorney_assigned?: boolean
          bundle_group?: string | null
          created_at?: string
          description?: string | null
          filing_date?: string | null
          id?: string
          nickname: string
          notes?: string | null
          np_deadline: string
          patent_number: string
          priority_level?: string
          status?: string
        }
        Update: {
          attorney_assigned?: boolean
          bundle_group?: string | null
          created_at?: string
          description?: string | null
          filing_date?: string | null
          id?: string
          nickname?: string
          notes?: string | null
          np_deadline?: string
          patent_number?: string
          priority_level?: string
          status?: string
        }
        Relationships: []
      }
      pilot_engagements: {
        Row: {
          bed_count: number | null
          contact_email: string
          contact_name: string
          created_at: string
          created_by: string | null
          ehr_system: string | null
          facility_type: string | null
          icu_beds: number | null
          id: string
          metrics: Json | null
          notes: string | null
          organization_name: string
          pilot_end_date: string | null
          pilot_start_date: string | null
          status: string
          unit_deployed: string | null
          updated_at: string
        }
        Insert: {
          bed_count?: number | null
          contact_email: string
          contact_name: string
          created_at?: string
          created_by?: string | null
          ehr_system?: string | null
          facility_type?: string | null
          icu_beds?: number | null
          id?: string
          metrics?: Json | null
          notes?: string | null
          organization_name: string
          pilot_end_date?: string | null
          pilot_start_date?: string | null
          status?: string
          unit_deployed?: string | null
          updated_at?: string
        }
        Update: {
          bed_count?: number | null
          contact_email?: string
          contact_name?: string
          created_at?: string
          created_by?: string | null
          ehr_system?: string | null
          facility_type?: string | null
          icu_beds?: number | null
          id?: string
          metrics?: Json | null
          notes?: string | null
          organization_name?: string
          pilot_end_date?: string | null
          pilot_start_date?: string | null
          status?: string
          unit_deployed?: string | null
          updated_at?: string
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
      security_risk_assessments: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          assessment_type: string
          assessment_year: number
          assessor_name: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          critical_findings: number | null
          findings_count: number | null
          high_findings: number | null
          id: string
          low_findings: number | null
          medium_findings: number | null
          next_review_date: string | null
          overall_risk_level: string | null
          recommendations: string | null
          status: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          assessment_type?: string
          assessment_year: number
          assessor_name?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          critical_findings?: number | null
          findings_count?: number | null
          high_findings?: number | null
          id?: string
          low_findings?: number | null
          medium_findings?: number | null
          next_review_date?: string | null
          overall_risk_level?: string | null
          recommendations?: string | null
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          assessment_type?: string
          assessment_year?: number
          assessor_name?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          critical_findings?: number | null
          findings_count?: number | null
          high_findings?: number | null
          id?: string
          low_findings?: number | null
          medium_findings?: number | null
          next_review_date?: string | null
          overall_risk_level?: string | null
          recommendations?: string | null
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_archives: {
        Row: {
          captured_at: string
          content_hash: string
          created_at: string
          html_content: string | null
          id: string
          markdown_content: string | null
          metadata: Json | null
          notes: string | null
          page_title: string | null
          page_url: string
          trigger_type: string
        }
        Insert: {
          captured_at?: string
          content_hash: string
          created_at?: string
          html_content?: string | null
          id?: string
          markdown_content?: string | null
          metadata?: Json | null
          notes?: string | null
          page_title?: string | null
          page_url: string
          trigger_type?: string
        }
        Update: {
          captured_at?: string
          content_hash?: string
          created_at?: string
          html_content?: string | null
          id?: string
          markdown_content?: string | null
          metadata?: Json | null
          notes?: string | null
          page_title?: string | null
          page_url?: string
          trigger_type?: string
        }
        Relationships: []
      }
      sla_metrics: {
        Row: {
          check_type: string
          checked_at: string
          created_at: string
          endpoint: string
          error_message: string | null
          http_status: number | null
          id: string
          response_time_ms: number | null
          status: string
          vendor_id: string | null
        }
        Insert: {
          check_type?: string
          checked_at?: string
          created_at?: string
          endpoint: string
          error_message?: string | null
          http_status?: number | null
          id?: string
          response_time_ms?: number | null
          status?: string
          vendor_id?: string | null
        }
        Update: {
          check_type?: string
          checked_at?: string
          created_at?: string
          endpoint?: string
          error_message?: string | null
          http_status?: number | null
          id?: string
          response_time_ms?: number | null
          status?: string
          vendor_id?: string | null
        }
        Relationships: []
      }
      slide_analytics: {
        Row: {
          created_at: string
          first_viewed_at: string
          id: string
          is_patent_slide: boolean | null
          last_viewed_at: string
          session_id: string | null
          slide_id: string
          slide_title: string | null
          time_spent_seconds: number
          view_count: number
        }
        Insert: {
          created_at?: string
          first_viewed_at?: string
          id?: string
          is_patent_slide?: boolean | null
          last_viewed_at?: string
          session_id?: string | null
          slide_id: string
          slide_title?: string | null
          time_spent_seconds?: number
          view_count?: number
        }
        Update: {
          created_at?: string
          first_viewed_at?: string
          id?: string
          is_patent_slide?: boolean | null
          last_viewed_at?: string
          session_id?: string | null
          slide_id?: string
          slide_title?: string | null
          time_spent_seconds?: number
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "slide_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "presentation_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "slide_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "public_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_apps: {
        Row: {
          client_id: string
          client_name: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          launch_url: string | null
          logo_url: string | null
          redirect_uris: string[]
          scopes: string[]
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          client_id: string
          client_name: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          launch_url?: string | null
          logo_url?: string | null
          redirect_uris?: string[]
          scopes?: string[]
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          client_id?: string
          client_name?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          launch_url?: string | null
          logo_url?: string | null
          redirect_uris?: string[]
          scopes?: string[]
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "smart_apps_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_api_keys"
            referencedColumns: ["vendor_id"]
          },
        ]
      }
      tabletop_exercises: {
        Row: {
          action_items: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          duration_minutes: number | null
          exercise_date: string
          facilitator_name: string | null
          findings: string | null
          id: string
          next_exercise_date: string | null
          participants: string[] | null
          scenario_description: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          action_items?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          exercise_date: string
          facilitator_name?: string | null
          findings?: string | null
          id?: string
          next_exercise_date?: string | null
          participants?: string[] | null
          scenario_description: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          action_items?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          exercise_date?: string
          facilitator_name?: string | null
          findings?: string | null
          id?: string
          next_exercise_date?: string | null
          participants?: string[] | null
          scenario_description?: string
          status?: string
          title?: string
          updated_at?: string
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
      vendor_api_keys: {
        Row: {
          allowed_ips: string[] | null
          api_key_hash: string
          api_key_prefix: string
          baa_signed: boolean
          contact_email: string | null
          contact_name: string | null
          created_at: string
          created_by: string | null
          environment: string
          expires_at: string | null
          id: string
          is_active: boolean
          last_used_at: string | null
          nda_signed: boolean
          notes: string | null
          rate_limit_per_min: number
          scopes: string[] | null
          total_requests: number
          vendor_id: string
          vendor_name: string
        }
        Insert: {
          allowed_ips?: string[] | null
          api_key_hash: string
          api_key_prefix: string
          baa_signed?: boolean
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          created_by?: string | null
          environment?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          nda_signed?: boolean
          notes?: string | null
          rate_limit_per_min?: number
          scopes?: string[] | null
          total_requests?: number
          vendor_id: string
          vendor_name: string
        }
        Update: {
          allowed_ips?: string[] | null
          api_key_hash?: string
          api_key_prefix?: string
          baa_signed?: boolean
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          created_by?: string | null
          environment?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          nda_signed?: boolean
          notes?: string | null
          rate_limit_per_min?: number
          scopes?: string[] | null
          total_requests?: number
          vendor_id?: string
          vendor_name?: string
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
      webhook_delivery_log: {
        Row: {
          attempt_count: number
          created_at: string
          delivered_at: string | null
          error_message: string | null
          fhir_event_id: string | null
          http_status: number | null
          id: string
          last_attempt_at: string | null
          max_attempts: number
          next_retry_at: string | null
          response_body: string | null
          status: string
          target_url: string
          vendor_id: string | null
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          fhir_event_id?: string | null
          http_status?: number | null
          id?: string
          last_attempt_at?: string | null
          max_attempts?: number
          next_retry_at?: string | null
          response_body?: string | null
          status?: string
          target_url: string
          vendor_id?: string | null
        }
        Update: {
          attempt_count?: number
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          fhir_event_id?: string | null
          http_status?: number | null
          id?: string
          last_attempt_at?: string | null
          max_attempts?: number
          next_retry_at?: string | null
          response_body?: string | null
          status?: string
          target_url?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_delivery_log_fhir_event_id_fkey"
            columns: ["fhir_event_id"]
            isOneToOne: false
            referencedRelation: "fhir_events"
            referencedColumns: ["id"]
          },
        ]
      }
      witness_invitations: {
        Row: {
          attestation_id: string | null
          completed_at: string | null
          created_at: string
          document_hash: string
          document_version: string
          expires_at: string
          id: string
          invitation_token: string
          invited_at: string
          invited_by: string | null
          status: string
          witness_email: string
          witness_name: string | null
        }
        Insert: {
          attestation_id?: string | null
          completed_at?: string | null
          created_at?: string
          document_hash: string
          document_version: string
          expires_at?: string
          id?: string
          invitation_token?: string
          invited_at?: string
          invited_by?: string | null
          status?: string
          witness_email: string
          witness_name?: string | null
        }
        Update: {
          attestation_id?: string | null
          completed_at?: string | null
          created_at?: string
          document_hash?: string
          document_version?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          invited_at?: string
          invited_by?: string | null
          status?: string
          witness_email?: string
          witness_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "witness_invitations_attestation_id_fkey"
            columns: ["attestation_id"]
            isOneToOne: false
            referencedRelation: "patent_attestations"
            referencedColumns: ["id"]
          },
        ]
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
      check_witness_email: {
        Args: { _witness_email: string }
        Returns: boolean
      }
      cleanup_rate_limit_violations: {
        Args: { p_older_than_days?: number }
        Returns: number
      }
      cleanup_rate_limits: {
        Args: { p_older_than_hours?: number }
        Returns: number
      }
      decrypt_pii: { Args: { ciphertext: string }; Returns: string }
      decrypt_witness_email: {
        Args: { attestation_id: string }
        Returns: string
      }
      encrypt_pii: { Args: { plaintext: string }; Returns: string }
      get_decrypted_attestations: {
        Args: never
        Returns: {
          attestation_group_id: string
          attested_at: string
          claims_count: number
          confirmed_at: string
          created_at: string
          document_hash: string
          document_version: string
          email_confirmed: boolean
          id: string
          ip_address: string
          organization: string
          signature: string
          witness_email: string
          witness_name: string
          witness_title: string
        }[]
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
