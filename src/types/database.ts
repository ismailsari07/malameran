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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      rate_limits: {
        Row: {
          bucket_key: string
          count: number
          window_start: string
        }
        Insert: {
          bucket_key: string
          count?: number
          window_start: string
        }
        Update: {
          bucket_key?: string
          count?: number
          window_start?: string
        }
        Relationships: []
      }
      request_files: {
        Row: {
          created_at: string
          declared_mime: string | null
          detected_mime: string | null
          id: string
          original_filename: string
          rejection_reason: string | null
          request_id: string
          size_bytes: number
          status: Database["public"]["Enums"]["request_file_status"]
          storage_path: string
        }
        Insert: {
          created_at?: string
          declared_mime?: string | null
          detected_mime?: string | null
          id?: string
          original_filename: string
          rejection_reason?: string | null
          request_id: string
          size_bytes: number
          status?: Database["public"]["Enums"]["request_file_status"]
          storage_path: string
        }
        Update: {
          created_at?: string
          declared_mime?: string | null
          detected_mime?: string | null
          id?: string
          original_filename?: string
          rejection_reason?: string | null
          request_id?: string
          size_bytes?: number
          status?: Database["public"]["Enums"]["request_file_status"]
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_files_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "sourcing_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      sourcing_requests: {
        Row: {
          certifications: string[] | null
          company: string | null
          contact_name: string
          created_at: string
          email: string
          id: string
          industry: string | null
          note: string | null
          phone: string | null
          preferred_country: string | null
          product_description: string
          quantity: string | null
          ref_number: number
          reference: string | null
          request_type: string | null
          target_delivery_date: string | null
          target_price: string | null
        }
        Insert: {
          certifications?: string[] | null
          company?: string | null
          contact_name: string
          created_at?: string
          email: string
          id?: string
          industry?: string | null
          note?: string | null
          phone?: string | null
          preferred_country?: string | null
          product_description: string
          quantity?: string | null
          ref_number?: number
          reference?: string | null
          request_type?: string | null
          target_delivery_date?: string | null
          target_price?: string | null
        }
        Update: {
          certifications?: string[] | null
          company?: string | null
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          industry?: string | null
          note?: string | null
          phone?: string | null
          preferred_country?: string | null
          product_description?: string
          quantity?: string | null
          ref_number?: number
          reference?: string | null
          request_type?: string | null
          target_delivery_date?: string | null
          target_price?: string | null
        }
        Relationships: []
      }
      supplier_applications: {
        Row: {
          certifications: string[] | null
          company_name: string
          contact_name: string
          country: string
          created_at: string
          email: string
          id: string
          manufacturing_categories: string[]
          monthly_capacity: string | null
          note: string | null
          phone: string | null
          ref_number: number
          reference: string | null
          website: string | null
        }
        Insert: {
          certifications?: string[] | null
          company_name: string
          contact_name: string
          country: string
          created_at?: string
          email: string
          id?: string
          manufacturing_categories: string[]
          monthly_capacity?: string | null
          note?: string | null
          phone?: string | null
          ref_number?: number
          reference?: string | null
          website?: string | null
        }
        Update: {
          certifications?: string[] | null
          company_name?: string
          contact_name?: string
          country?: string
          created_at?: string
          email?: string
          id?: string
          manufacturing_categories?: string[]
          monthly_capacity?: string | null
          note?: string | null
          phone?: string | null
          ref_number?: number
          reference?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_bucket_key: string
          p_max_hits: number
          p_window_seconds: number
        }
        Returns: boolean
      }
      text_array_within: {
        Args: { arr: string[]; max_len: number }
        Returns: boolean
      }
    }
    Enums: {
      request_file_status: "pending" | "verified" | "rejected"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      request_file_status: ["pending", "verified", "rejected"],
    },
  },
} as const
