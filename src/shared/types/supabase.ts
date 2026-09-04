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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      book_catalog: {
        Row: {
          author: string | null
          category_id: number | null
          category_name: string
          created_at: string | null
          description: string | null
          embedding: string | null
          id: string
          isbn13: string | null
          item_id: string
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          author?: string | null
          category_id?: number | null
          category_name: string
          created_at?: string | null
          description?: string | null
          embedding?: string | null
          id?: string
          isbn13?: string | null
          item_id: string
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          author?: string | null
          category_id?: number | null
          category_name?: string
          created_at?: string | null
          description?: string | null
          embedding?: string | null
          id?: string
          isbn13?: string | null
          item_id?: string
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      book_stats: {
        Row: {
          book_id: string
          comment_count: number
          created_at: string
          isbn13: string | null
          like_count: number
          updated_at: string
          view_count: number
        }
        Insert: {
          book_id: string
          comment_count?: number
          created_at?: string
          isbn13?: string | null
          like_count?: number
          updated_at?: string
          view_count?: number
        }
        Update: {
          book_id?: string
          comment_count?: number
          created_at?: string
          isbn13?: string | null
          like_count?: number
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "book_stats_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: true
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_views: {
        Row: {
          book_id: string
          composite_hash: string | null
          device_key: string
          hidden: boolean
          id: string
          ip_hash: string | null
          isbn13: string
          user_agent_hash: string | null
          user_id: string | null
          view_date: string
          viewed_at: string
        }
        Insert: {
          book_id: string
          composite_hash?: string | null
          device_key: string
          hidden?: boolean
          id?: string
          ip_hash?: string | null
          isbn13: string
          user_agent_hash?: string | null
          user_id?: string | null
          view_date?: string
          viewed_at?: string
        }
        Update: {
          book_id?: string
          composite_hash?: string | null
          device_key?: string
          hidden?: boolean
          id?: string
          ip_hash?: string | null
          isbn13?: string
          user_agent_hash?: string | null
          user_id?: string | null
          view_date?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_views_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmark_tag_links: {
        Row: {
          bookmark_id: string
          created_at: string
          id: string
          tag_id: string
        }
        Insert: {
          bookmark_id: string
          created_at?: string
          id?: string
          tag_id: string
        }
        Update: {
          bookmark_id?: string
          created_at?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmark_tag_links_bookmark_id_fkey"
            columns: ["bookmark_id"]
            isOneToOne: false
            referencedRelation: "bookmarks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmark_tag_links_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "bookmark_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmark_tags: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          slug: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          slug: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          slug?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmark_tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          book_id: string
          created_at: string
          id: string
          isbn13: string
          memo: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          isbn13: string
          memo?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          isbn13?: string
          memo?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string | null
          category_id: number | null
          category_name: string | null
          created_at: string
          id: string
          isbn13: string
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          author?: string | null
          category_id?: number | null
          category_name?: string | null
          created_at?: string
          id?: string
          isbn13: string
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          author?: string | null
          category_id?: number | null
          category_name?: string | null
          created_at?: string
          id?: string
          isbn13?: string
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          book_id: string
          content: string
          created_at: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      keep_alive: {
        Row: {
          id: number
          pinged_at: string | null
        }
        Insert: {
          id: number
          pinged_at?: string | null
        }
        Update: {
          id?: number
          pinged_at?: string | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          book_id: string
          created_at: string
          id: string
          isbn13: string
          user_id: string
        }
        Insert: {
          book_id: string
          created_at?: string
          id?: string
          isbn13: string
          user_id: string
        }
        Update: {
          book_id?: string
          created_at?: string
          id?: string
          isbn13?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_snapshots: {
        Row: {
          created_at: string
          isbn13: string
          rank: number
          score: number
          snapshot_date: string
        }
        Insert: {
          created_at?: string
          isbn13: string
          rank: number
          score: number
          snapshot_date: string
        }
        Update: {
          created_at?: string
          isbn13?: string
          rank?: number
          score?: number
          snapshot_date?: string
        }
        Relationships: []
      }
      user_book_comments: {
        Row: {
          book_id: string
          comment_count: number
          created_at: string
          id: string
          last_commented_at: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          comment_count?: number
          created_at?: string
          id?: string
          last_commented_at?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          comment_count?: number
          created_at?: string
          id?: string
          last_commented_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_books_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_book_comments_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      user_recommendations: {
        Row: {
          created_at: string
          id: string
          input_snapshot: Json | null
          recommendations: Json | null
          regen_count: number
          regen_date: string
          taste_summary: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_snapshot?: Json | null
          recommendations?: Json | null
          regen_count?: number
          regen_date: string
          taste_summary?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          input_snapshot?: Json | null
          recommendations?: Json | null
          regen_count?: number
          regen_date?: string
          taste_summary?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_recommendations_v2: {
        Row: {
          anchor_cursor: number
          label: string | null
          rails_created_at: string | null
          reacted_count: number
          recommendations: Json | null
          taste_created_at: string | null
          taste_summary: Json | null
          user_id: string
        }
        Insert: {
          anchor_cursor?: number
          label?: string | null
          rails_created_at?: string | null
          reacted_count?: number
          recommendations?: Json | null
          taste_created_at?: string | null
          taste_summary?: Json | null
          user_id: string
        }
        Update: {
          anchor_cursor?: number
          label?: string | null
          rails_created_at?: string | null
          reacted_count?: number
          recommendations?: Json | null
          taste_created_at?: string | null
          taste_summary?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_recommendations_v2_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          email_change_token_hash: string | null
          id: string
          nickname: string
          password_reset_email: string | null
          password_reset_expires_at: string | null
          password_reset_token_hash: string | null
          pending_email: string | null
          pending_email_expires_at: string | null
          persona_at: string | null
          persona_id: string | null
          persona_title: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          email_change_token_hash?: string | null
          id?: string
          nickname: string
          password_reset_email?: string | null
          password_reset_expires_at?: string | null
          password_reset_token_hash?: string | null
          pending_email?: string | null
          pending_email_expires_at?: string | null
          persona_at?: string | null
          persona_id?: string | null
          persona_title?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          email_change_token_hash?: string | null
          id?: string
          nickname?: string
          password_reset_email?: string | null
          password_reset_expires_at?: string | null
          password_reset_token_hash?: string | null
          pending_email?: string | null
          pending_email_expires_at?: string | null
          persona_at?: string | null
          persona_id?: string | null
          persona_title?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      book_ranking: {
        Row: {
          author: string | null
          category_id: number | null
          category_name: string | null
          comment_count: number | null
          isbn13: string | null
          like_count: number | null
          score: number | null
          thumbnail_url: string | null
          title: string | null
          view_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_user: { Args: { user_id: string }; Returns: undefined }
      get_last_reacted_at: { Args: { p_user_id: string }; Returns: string }
      get_reacted_count: { Args: { p_user_id: string }; Returns: number }
      get_signal_mix: {
        Args: { p_user_id: string }
        Returns: {
          bookmarks: number
          comments: number
          likes: number
          views: number
        }[]
      }
      get_taste_distribution: {
        Args: { p_user_id: string }
        Returns: {
          cnt: number
          genre: string
        }[]
      }
      get_top_anchor: {
        Args: { p_user_id: string }
        Returns: {
          category_id: number
          category_name: string
          isbn13: string
          title: string
        }[]
      }
      match_book: {
        Args: {
          categories?: string[]
          match_count: number
          query_embedding: string
        }
        Returns: {
          author: string
          category_id: number
          category_name: string
          isbn13: string
          item_id: string
          similarity: number
          thumbnail_url: string
          title: string
        }[]
      }
      match_book_for_user: {
        Args: {
          match_count?: number
          p_anchor_isbn13?: string
          p_user_id: string
        }
        Returns: {
          author: string
          category_id: number
          category_name: string
          isbn13: string
          item_id: string
          similarity: number
          thumbnail_url: string
          title: string
        }[]
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
    Enums: {},
  },
} as const
